import { useState } from 'react';
import { useActiveReservation } from '../../hooks/useActiveReservation';
import { convertToEmbedUrl } from '../../utils/urlUtils';

const STATUS_MAP = {
  RESTING: { text: '휴식중', icon: 'fa-bed' },
  PLAYING:  { text: '놀이중', icon: 'fa-futbol' },
  EATING:   { text: '식사중', icon: 'fa-utensils' },
  WALKING:  { text: '산책중', icon: 'fa-person-walking' },
  BRAIN:    { text: '교육 프로그램 진행중', icon: 'fa-graduation-cap' },
};

// ──────────────────────────────────────────────
//  CCTV 플로팅 버튼 + 모달
//  로그인 상태이고 활성 예약이 있을 때만 표시
// ──────────────────────────────────────────────
export default function CctvModal() {
  const { reservation, loading } = useActiveReservation();
  const [isOpen, setIsOpen] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');

  if (loading || !reservation) return null;

  const handleOpen = () => {
    if (reservation.cctvUrl) {
      setIframeSrc(convertToEmbedUrl(reservation.cctvUrl));
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIframeSrc(''); // iframe 정지
  };

  const statusInfo = reservation.petStatus?.status
    ? STATUS_MAP[reservation.petStatus.status] || { text: reservation.petStatus.status, icon: 'fa-circle-question' }
    : null;

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={handleOpen}
        style={{
          position: 'fixed', bottom: 180, right: 30,
          width: 60, height: 60,
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          borderRadius: '50%', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(231,76,60,0.4)', zIndex: 999,
          animation: 'cctvPulse 2s infinite',
        }}
        aria-label="CCTV 열기"
      >
        <i className="fa-solid fa-video" style={{ color: 'white', fontSize: 26 }} />
        <span style={{
          position: 'absolute', top: -8, right: -8,
          background: '#27ae60', color: 'white', fontSize: 10,
          fontWeight: 'bold', padding: '3px 8px', borderRadius: 12,
          textTransform: 'uppercase', letterSpacing: '0.5px',
          animation: 'blink 1.5s infinite',
        }}>
          LIVE
        </span>
      </button>

      {/* 모달 오버레이 */}
      {isOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.85)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 0.3s',
          }}
        >
          <div style={{
            background: '#1a1a1a', borderRadius: 16,
            width: '92%', maxWidth: 1100, maxHeight: '82vh',
            overflow: 'hidden', boxShadow: '0 10px 50px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column',
            animation: 'slideUp 0.4s',
          }}>
            {/* 헤더 */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
              flexShrink: 0,
            }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="fa-solid fa-video" />
                실시간 CCTV
                <span style={{
                  background: '#27ae60', color: 'white', fontSize: '0.7rem',
                  fontWeight: 'bold', padding: '4px 10px', borderRadius: 12,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  animation: 'blink 1.5s infinite',
                }}>
                  ● LIVE
                </span>
              </h3>
              <button onClick={handleClose} style={{
                background: 'none', border: 'none', color: 'white',
                fontSize: 26, cursor: 'pointer', borderRadius: '50%',
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* 바디 */}
            <div style={{ background: '#000', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

              {reservation.cctvUrl ? (
                <>
                  {/* 영상 */}
                  <div style={{ position: 'relative', width: '100%', maxHeight: '46vh' }}>
                    <div style={{ paddingTop: '56.25%' }} />
                    <iframe
                      src={iframeSrc}
                      title="CCTV"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    />
                  </div>

                  {/* 정보 */}
                  <div style={{
                    padding: '16px 20px', background: '#2c2c2c', color: '#fff',
                    overflowY: 'auto', maxHeight: '34vh',
                  }}>
                    {/* 객실 정보 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                      <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                        {reservation.roomType}
                      </div>
                      <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem', color: '#aaa' }}>
                        <span><i className="fa-solid fa-calendar-check" style={{ marginRight: 5 }} />{reservation.checkin}</span>
                        <span><i className="fa-solid fa-calendar-xmark" style={{ marginRight: 5 }} />{reservation.checkout}</span>
                      </div>
                    </div>

                    {/* 반려견 상태 */}
                    <div style={{
                      background: '#1a1a1a', borderRadius: 12, padding: 16,
                      marginTop: 12, border: '2px solid #333',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #444' }}>
                        <i className="fa-solid fa-paw" />
                        <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>
                          {reservation.petName}의 현재 상태
                        </h4>
                      </div>

                      {statusInfo ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                          <div style={{ background: '#fff', padding: '12px 14px', borderRadius: 8, borderLeft: '3px solid #c0392b' }}>
                            <div style={{ fontSize: '0.8rem', color: '#000', marginBottom: 4 }}>
                              <i className={`fa-solid ${statusInfo.icon}`} style={{ marginRight: 5 }} />현재 상태
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#000' }}>{statusInfo.text}</div>
                          </div>
                          <div style={{ background: '#fff', padding: '12px 14px', borderRadius: 8, borderLeft: '3px solid #c0392b' }}>
                            <div style={{ fontSize: '0.8rem', color: '#000', marginBottom: 4 }}>
                              <i className="fa-solid fa-clock" style={{ marginRight: 5 }} />다음 일정
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#000' }}>
                              {reservation.petStatus?.nextSchedule || '없음'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p style={{ color: '#999', fontSize: '0.9rem', margin: 0 }}>
                          현재 상태 정보가 업데이트되지 않았습니다.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
                  <i className="fa-solid fa-video-slash" style={{ fontSize: 40, marginBottom: 16 }} />
                  <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>CCTV 준비 중</h4>
                  <p>현재 객실의 CCTV가 설정되지 않았습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
