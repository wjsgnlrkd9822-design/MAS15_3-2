import { useEffect } from 'react'

export default function KakaoPayRefund() {
  const closeAndReload = () => {
    if (window.opener) {
      window.opener.location.reload()
      window.close()
    } else {
      window.location.href = '/mypage'
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', fontFamily: "'Noto Sans KR', sans-serif"
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px', padding: '48px 40px',
        textAlign: 'center', maxWidth: '420px', width: '90%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: '#fee2e2', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 24px'
        }}>
          <span style={{ fontSize: '40px' }}>💸</span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
          환불이 완료되었습니다
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px' }}>
          환불 처리가 정상적으로 완료되었습니다
        </p>
        <button onClick={closeAndReload} style={{
          width: '100%', padding: '14px', borderRadius: '10px',
          border: 'none', background: '#ef4444', color: '#fff',
          fontSize: '16px', fontWeight: 600, cursor: 'pointer'
        }}>
          확인
        </button>
      </div>
    </div>
  )
}