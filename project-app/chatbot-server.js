// ============================================================
//  PETHOUSE 챗봇 백엔드 API
//  기존 Spring Boot 백엔드에 추가하거나,
//  별도 Node.js 서버로 실행 후 Vite proxy로 연결
//
//  Node.js 방식:
//    npm install express mysql2 openai cors dotenv
//    node chatbot-server.js
//
//  vite.config.js proxy 설정:
//    '/api/chat': 'http://localhost:3001'
// ============================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import OpenAI from 'openai';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || '127.0.0.1',
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'aloha',
  charset:  'utf8mb4',
  connectionLimit: 10,
});

async function fetchHotelContext(userMessage) {
  const conn = await pool.getConnection();
  let ctx = '';

  try {
    const [rooms] = await conn.query(`
      SELECT room_no, room_type, room_price, etc, active
      FROM hotelrooms
      ORDER BY room_price DESC
    `);

    const roomGroups = {};
    rooms.forEach(r => {
      if (!roomGroups[r.room_type]) roomGroups[r.room_type] = { price: r.room_price, total: 0, available: 0, desc: r.etc };
      roomGroups[r.room_type].total++;
      if (r.active === '예약가능') roomGroups[r.room_type].available++;
    });

    ctx += '=== 객실 현황 ===\n';
    Object.entries(roomGroups).forEach(([type, info]) => {
      ctx += `[${type}] ${info.desc} | 1박 ${info.price.toLocaleString()}원 | 잔여 ${info.available}/${info.total}실\n`;
    });

    const [services] = await conn.query(`
      SELECT service_name, description, service_price
      FROM hotelservices
      ORDER BY service_no
    `);
    if (services.length > 0) {
      ctx += '\n=== 부가 서비스 ===\n';
      services.forEach(s => {
        ctx += `[${s.service_name}] ${s.description} | ${s.service_price.toLocaleString()}원\n`;
      });
    }

    if (/훈련|트레이너|교육|훈련사/.test(userMessage)) {
      const [trainers] = await conn.query(`
        SELECT trainer_name, detail, gender FROM trainers ORDER BY trainer_no
      `);
      if (trainers.length > 0) {
        ctx += '\n=== 트레이너 ===\n';
        trainers.forEach(t => {
          ctx += `[${t.trainer_name} (${t.gender})] ${t.detail}\n`;
        });
      }
    }

    const [notices] = await conn.query(`
      SELECT title, content FROM notices
      ORDER BY reg_date DESC LIMIT 3
    `);
    if (notices.length > 0) {
      ctx += '\n=== 최근 공지사항 ===\n';
      notices.forEach(n => {
        ctx += `[${n.title}] ${n.content.substring(0, 80)}...\n`;
      });
    }

  } finally {
    conn.release();
  }

  return ctx;
}

app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: '메시지 없음' });

  try {
    const hotelContext = await fetchHotelContext(message);

    const systemPrompt = `당신은 "PETHOUSE 애견호텔"의 AI 상담 챗봇입니다.
아래의 실시간 호텔 데이터를 바탕으로 정확하고 친절하게 답변하세요.

${hotelContext}

답변 규칙:
1. 따뜻하고 친근한 말투를 사용하세요 (예: "~해요", "~드려요").
2. 금액은 반드시 원 단위로 표시하고 천 단위 구분자를 사용하세요.
3. 객실 종류 설명:
   - Small Dog / Small Dog Deluxe → 소형견용 객실
   - Medium Dog / Medium Dog Deluxe → 중형견용 객실
   - Large Dog / Large Dog Deluxe → 대형견용 객실
   - Deluxe는 일반보다 넓은 공간의 업그레이드 객실
4. 잔여 객실 수는 타입별로 각각 따로 안내하세요.
   예시: "Large Dog 3실, Large Dog Deluxe 1실 예약 가능해요!"
5. 대형견 문의 시 Large Dog, Large Dog Deluxe 두 타입 모두 안내하세요.
6. DB에 없는 정보(체크인 시간, 주차 등)는 "자세한 사항은 전화 문의를 부탁드려요 📞"로 안내하세요.
7. 예약은 홈페이지 예약 페이지를 안내하세요.
8. 답변은 간결하게 3~5줄 이내로, 이모지를 1~2개 적절히 사용하세요.
9. 고객이 트레이너 문의 시, 트레이너 이름과 간단한 설명을 안내하세요.
10. 고객이 공지사항 문의 시, 최근 3개의 공지사항 제목과 간단한 내용을 안내하세요.
11. 고객이 부가 서비스 문의 시, 서비스 이름과 간단한 설명, 가격을 안내하세요.
12. 주소를 물어보면 경원대로 1366 7층 더조은컴퓨터아카데미 인천캠퍼스 여기로 안내해줘. 링크는 https://map.naver.com/p/directions/-/14106470.8171145,4507773.8519413,%EB%8D%94%EC%A1%B0%EC%9D%80%EC%BB%B4%ED%93%A8%ED%84%B0%EC%95%84%EC%B9%B4%EB%8D%B0%EB%AF%B8%ED%95%99%EC%9B%90%20%EC%9D%B8%EC%B2%9C%EC%A0%90,1516930945,PLACE_POI/-/transit?c=14.69,0,0,0,dh 여기로
13. 고객이 예약 문의 시, "예약은 홈페이지 예약 페이지에서 가능해요! https://pethouse.com/reservation"로 안내하세요.
14. 고객이 체크인/체크아웃 시간, 주차 여부 등 DB에 없는 정보를 물어보면 "자세한 사항은 전화 문의를 부탁드려요 📞"로 안내하세요.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 500,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-10),
        { role: 'user', content: message },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });

  } catch (err) {
    console.error('Chatbot error:', err.message);
    res.status(500).json({ error: '서버 오류' });
  }
});

app.get('/health', (_, res) => res.json({ ok: true }));

app.listen(3001, () => console.log('🐾 PETHOUSE 챗봇 서버: http://localhost:3001'));