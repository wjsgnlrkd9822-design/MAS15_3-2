import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoticeModal from './NoticeModal';
import CctvModal from './CctvModal';
import { getNotices } from '../../apis/noticeApi';


// ──────────────────────────────────────────────
//  메인 홈페이지
//  Thymeleaf main.html → React 변환
// ──────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [noticeList, setNoticeList] = useState([]);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    getNotices()
      .then((data) => { if (data.success) setNoticeList(data.noticeList); })
      .catch(console.error);
  }, []);

  return (
    <>
      {/* ─── 히어로 섹션 ─── */}
      <div className="container">
        <div className="hero">
          <img src="/img/mainpage.jpg" alt="메인 이미지" />
          <div className="hero-content">
            <h1>
              사랑하는 반려견을 위한<br />
              특별한 휴식 공간
            </h1>
            <p>
              24시간 전문 케어와 최상의 시설로<br />
              반려견의 행복한 시간을 약속합니다
            </p>
            <button
              className="hero-btn"
              onClick={() => navigate('/pet/reservation')}
            >
              지금 예약하기
            </button>
          </div>
        </div>
      </div>

      {/* ─── 왜 PETHOUSE인가요 ─── */}
      <section className="why-section">
        <div className="why-inner">
          <h2>왜 PETHOUSE 인가요?</h2>
          <p className="why-sub">반려견의 안전과 행복을 최우선으로 생각합니다</p>
          <div className="why-cards">
            {[
              { icon: 'fa-shield-dog',     title: '안전한 환경', desc: '24시간 CCTV 관제와 전문 수의사가 상주하는 안전한 공간' },
              { icon: 'fa-heart',          title: '사랑과 관심', desc: '매 순간 반려견에게 필요한 관심과 사랑을 제공합니다' },
              { icon: 'fa-user-nurse',     title: '전문 스태프', desc: '반려동물 전문 교육을 이수한 숙련된 케어 전문가' },
              { icon: 'fa-calendar-check', title: '편리한 예약', desc: '온라인으로 간편하게 예약하고 실시간으로 확인' },
            ].map(({ icon, title, desc }) => (
              <div className="why-card" key={title}>
                <i className={`fa-solid ${icon}`} />
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 서비스 섹션 ─── */}
      <section className="service-section">
        <div className="service-inner">
          {[
            {
              img: '/img/service-hotel.jpg', title: '호텔링 서비스',
              desc: '쾌적한 개별 객실에서 편안한 휴식을 제공합니다',
              items: ['개별 공조 시스템', '프리미엄 침구', '실시간 CCTV 제공'],
            },
            {
              img: '/img/cctv.jpg', title: '24시간 CCTV',
              desc: '보호자가 언제 어디서나 반려견의 상태를 실시간으로 확인할 수 있습니다.',
              items: ['실시간 영상 스트리밍', '모바일·PC 원격 접속', '녹화 영상 다시보기'],
            },
            {
              img: '/img/service-grooming.jpg', title: '그루밍 서비스',
              desc: '전문 그루머가 제공하는 스파 & 미용 서비스',
              items: ['목욕 및 드라이', '스타일 컷', '스킨케어'],
            },
          ].map(({ img, title, desc, items }) => (
            <div className="home-service-card" key={title}>
              <img src={img} alt={title} />
              <h3>{title}</h3>
              <p className="service-desc">{desc}</p>
              <ul>
                {items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 예약 CTA 섹션 ─── */}
      <section className="reservation">
        <p className="reservation-text1">지금 바로 예약하세요!</p>
        <p className="reservation-subtext">사랑하는 반려견에게 특별한 경험을 선물하세요</p>
        <button className="reservation-btn" onClick={() => navigate('/pet/reservation')}>
          예약 문의하기
        </button>
      </section>

      {/* ─── 공지사항 팝업 ─── */}
      <NoticeModal noticeList={noticeList} />

      {/* ─── CCTV 플로팅 버튼 ─── */}
      <CctvModal />
    </>
  );
}