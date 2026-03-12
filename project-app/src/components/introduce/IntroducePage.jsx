import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/introduce.css'

// ──────────────────────────────────────────────
//  이미지 슬라이더 (introduce 시설 섹션용)
// ──────────────────────────────────────────────
function FacilitySlider({ images, alt }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div className="facility-slider">
      <button className="slider-btn prev-btn" onClick={prev}>
        <i className="fas fa-chevron-left" />
      </button>
      <div className="slider-container">
        <div className="slider-track">
          <div className="slide">
            <img src={images[idx]} alt={`${alt}${idx + 1}`} />
          </div>
        </div>
      </div>
      <button className="slider-btn next-btn" onClick={next}>
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────
//  소개 페이지 (introduce.html → React)
// ──────────────────────────────────────────────
export default function IntroducePage() {
  const navigate = useNavigate();

  const facilities = [
    {
      images: ['/img/방음실.jpg', '/img/room_101.jpg', '/img/room_201.jpg'],
      title: '프리미엄 객실', desc: '쾌적하고 안전한 개별 객실',
    },
    {
      images: ['/img/service-play.jpg', '/img/playroom.jpg', '/img/playroom2.jpg', '/img/playroom3.jpg'],
      title: '놀이 공간', desc: '실내외 전용 놀이터',
    },
    {
      images: ['/img/의료.jpg', '/img/진료실.jpg'],
      title: '케어 공간', desc: '전문 의료 케어 시설',
    },
    {
      images: ['/img/미용.jpg', '/img/목욕.jpg', '/img/그루밍룸.jpg'],
      title: '위생 관리', desc: '청결한 그루밍 시설',
    },
  ];

  const team = [
    { img: '/img/원장.jpg',  name: '강형욱 원장',   role: '대표/동물행동 전문가', career: '15년 경력 반려동물 행동 전문가' },
    { img: '/img/매니저.jpg', name: '김조은 매니저', role: '케어 총괄 매니저',     career: '10년 경력 펫 호텔 운영 전문가' },
    { img: '/img/수의사.jpg', name: '이국종 수의사', role: '협력 수의사',          career: '서울대 수의학과 졸업, 12년 임상 경험' },
  ];

  return (
    <>
      {/* ─── 히어로 ─── */}
      <div className="container">
        <div className="hero">
          <img src="/img/introduce.jpg" alt="소개 이미지" />
          <div className="hero-content">
            <h1>
              여기는 그냥 호텔이 아니라,<br />
              반려동물의 두 번째 집입니다
            </h1>
            <p>
              댕댕이 호텔은 반려동물을 가족처럼 대하는 프리미엄 펫 호텔입니다.<br /><br />
              안전한 환경, 전문적인 케어, 그리고 진심 어린 사랑으로 여러분의 소중한 가족을 돌보겠습니다.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 왜 시작했는가 ─── */}
      <section className="why-section">
        <div className="why-inner">
          <h2>우리는 왜 시작했는가</h2>
          <p className="why-sub">PETHOUSE의 시작</p>
          <div className="why-cards">
            {[
              { icon: 'fa-circle-exclamation', title: '믿고 맡길 곳이 없었습니다',
                desc: '출장과 여행 중, 사랑하는 반려견을 맡길 곳을 찾는 것은 언제나 걱정이었습니다. 이런 불안함속에서 여행을 즐길 수 없었습니다.' },
              { icon: 'fa-check', title: '직접 만들기로 했습니다',
                desc: '15년간 반려동물 행동학을 연구하고, 수많은 반려견 가족들을 만나며 쌓은 경험과 노하우를 바탕으로 진정으로 믿을 수 있는 펫 호텔을 만들기로 결심했습니다.' },
              { icon: 'fa-hotel', title: 'PETHOUSE',
                desc: '2020년부터 지금까지, 5,000마리 이상의 반려견이 행복한 시간을 보냈습니다. 대한민국에서 가장 신뢰받는 펫 호텔로 성장했습니다.' },
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

      {/* ─── 우리가 다르게 하는 것 ─── */}
      <section className="df-section">
        <div className="df-inner">
          <h2>우리가 다르게 하는 것</h2>
          <p className="df-sub">PETHOUSE만의 특별한 6가지 약속</p>
          <div className="df-cards">
            {[
              { icon: 'fa-dog',           title: '24시간 케어',       desc: '밤낮없이 전문 스태프가 상주하여 반려견을 돌봅니다.' },
              { icon: 'fa-camera',        title: 'CCTV 실시간 확인', desc: '언제 어디서나 우리 아이의 모습을 확인할 수 있습니다.' },
              { icon: 'fa-hospital',      title: '수의사 협업',       desc: '제휴 동물병원과 24시간 응급 체계 구축' },
              { icon: 'fa-hotel',         title: '호텔급 시설',       desc: '프리미엄 침구와 쾌적한 환경을 제공합니다' },
              { icon: 'fa-user-doctor',   title: '1마리 전담 관리',  desc: '각 반려견에게 전담 케어 매니저 배정' },
              { icon: 'fa-hand-sparkles', title: '철저한 위생',      desc: '매일 2회 이상 소독 및 청결 관리' },
            ].map(({ icon, title, desc }) => (
              <div className="df-card" key={title}>
                <i className={`fa-solid ${icon}`} />
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 시설 안내 ─── */}
      <section className="facilities-section">
        <div className="facilities-section-inner">
          <h2>시설 안내</h2>
          <p className="section-subtitle">최고의 환경에서 소중한 반려동물을 케어합니다</p>
          <div className="facilities-grid">
            {facilities.map(({ images, title, desc }) => (
              <div className="facility-item" key={title}>
                <FacilitySlider images={images} alt={title} />
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 전문가 팀 ─── */}
      {/* ✅ introduce 전용 클래스명으로 변경 */}
      <section className="team-section">
        <div className="team-header">
          <h2>전문가 팀을 소개합니다</h2>
          <p>반려동물을 사랑하는 마음으로 최선을 다합니다</p>
        </div>
        <div className="team-inner">
          {team.map(({ img, name, role, career }) => (
            <div className="team-card" key={name}>
              <img src={img} alt={name} />
              <h3>{name}</h3>
              <p className="team-desc">{role}</p>
              <ul><li>{career}</li></ul>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CCTV 안내 ─── */}
      <section className="cctv-section">
        <div className="cctv-inner">
          <div className="cctv-image">
            <img src="/img/cctv.jpg" alt="CCTV 모니터링" />
          </div>
          <div className="cctv-content">
            <h2>언제나 안심하세요</h2>
            <p className="cctv-desc">
              모든 객실과 놀이 공간에 설치된 CCTV를 통해 언제 어디서든 우리 아이의 모습을 실시간으로 확인하실 수 있습니다.
              전용 앱을 통해 24시간 접속 가능하며, 중요한 순간은 영상으로 저장하여 보내드립니다.
            </p>
            <p className="cctv-contact">문의: 02-1234-5678</p>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="reservation">
        <p className="reservation-text1">우리 아이도 PETHOUSE에 맡겨보세요</p>
        <p className="reservation-subtext">
          5,000마리 이상의 반려견이 선택한 믿을 수 있는 PETHOUSE,<br />
          이제 여러분의 소중한 가족도 함께하세요.
        </p>
        <button className="reservation-btn" onClick={() => navigate('/pet/reservation')}>
          지금 예약하기
        </button>
      </section>
    </>
  );
}