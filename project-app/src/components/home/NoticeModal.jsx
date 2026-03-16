import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNoticePopup } from '../../hooks/useNoticePopup';

// ──────────────────────────────────────────────
//  공지사항 플로팅 버튼 + 팝업 모달
//  props:
//    noticeList: [{no, title, content, regDate}]
// ──────────────────────────────────────────────
export default function NoticeModal({ noticeList = [] }) {
  const [noShowChecked, setNoShowChecked] = useState(false);
  const { isOpen, currentIndex, open, close, goTo } = useNoticePopup(noticeList);
  const navigate = useNavigate();

  if (!noticeList.length) return null;

  const handleClose = () => close(noShowChecked);

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={open}
        style={{
          position: 'fixed', bottom: 100, right: 30,
          width: 60, height: 60,
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          borderRadius: '50%', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)', zIndex: 999,
          animation: 'pulse 2s infinite',
        }}
        aria-label="공지사항 열기"
      >
        <i className="fa-solid fa-bullhorn" style={{ color: 'white', fontSize: 24 }} />
        <span style={{
          position: 'absolute', top: -5, right: -5,
          background: '#e74c3c', color: 'white', fontSize: 12,
          fontWeight: 'bold', padding: '2px 6px', borderRadius: 10,
          minWidth: 20, textAlign: 'center',
        }}>
          {noticeList.length}
        </span>
      </button>

      {/* 오버레이 */}
      {isOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 0.3s',
          }}
        >
          <div style={{
            background: 'white', borderRadius: 16,
            width: '90%', maxWidth: 500, maxHeight: '80vh',
            overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column',
            animation: 'slideUp 0.3s',
          }}>
            {/* 헤더 */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 24px',
              background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'white', fontWeight: 600 }}>
                <i className="fa-solid fa-bullhorn" style={{ marginRight: 8 }} />
                공지사항
              </h3>
              <button onClick={handleClose} style={{
                background: 'none', border: 'none', color: 'white',
                fontSize: 24, cursor: 'pointer', borderRadius: '50%',
                width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* 바디 - 슬라이드 */}
            <div style={{ overflow: 'hidden', flex: 1 }}>
              {noticeList.map((notice, idx) => (
                <div
                  key={notice.no}
                  style={{ display: idx === currentIndex ? 'block' : 'none', padding: 24 }}
                >
                  <a
                    href={`/noticelist/${notice.no}`}
                    onClick={(e) => { e.preventDefault(); handleClose(); navigate(`/noticelist/${notice.no}`); }}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#2c3e50', margin: '0 0 12px' }}>
                      {notice.title}
                    </h4>
                    <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 16px', whiteSpace: 'pre-line' }}>
                      {notice.content}
                    </p>
                    <span style={{ color: '#999', fontSize: '0.85rem' }}>
                      {notice.regDate?.substring(0, 10)}
                    </span>
                  </a>
                </div>
              ))}
            </div>

            {/* 푸터 */}
            <div style={{
              padding: '16px 24px', background: '#f8f9fa',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: '#666', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={noShowChecked}
                    onChange={(e) => setNoShowChecked(e.target.checked)}
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                  />
                  오늘 하루 열지 않기
                </label>

                {/* 인디케이터 */}
                {noticeList.length > 1 && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    {noticeList.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goTo(idx)}
                        style={{
                          width: idx === currentIndex ? 24 : 8,
                          height: 8,
                          borderRadius: idx === currentIndex ? 4 : '50%',
                          background: idx === currentIndex ? '#2c3e50' : '#ddd',
                          border: 'none', cursor: 'pointer',
                          transition: 'all 0.3s', padding: 0,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <a
                href="/noticelist"
                onClick={(e) => { e.preventDefault(); handleClose(); navigate('/noticelist'); }}
                style={{ color: '#2c3e50', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}
              >
                전체보기 <i className="fa-solid fa-chevron-right" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
