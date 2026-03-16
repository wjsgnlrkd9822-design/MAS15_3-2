import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { common } from './adminStyles'
import Pagination from './Pagination'
import api from '../../api/api'

// ============================
// 쿠폰 관리 모달
// ============================
const CouponModal = ({ user, onClose }) => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)

  const loadCoupons = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/api/coupon/all/${user.no}`)
      setCoupons(res.data)
    } catch {
      alert('쿠폰 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCoupons() }, [user.no])

  const handleIssueNew = async () => {
    if (!window.confirm(`${user.name}님에게 신규가입 쿠폰을 발급하시겠습니까?`)) return
    try {
      await api.post(`/api/coupon/issue/new/${user.no}`)
      alert('신규가입 쿠폰이 발급되었습니다.')
      loadCoupons()
    } catch {
      alert('쿠폰 발급에 실패했습니다.')
    }
  }

  const handleIssueMonthly = async () => {
    if (!window.confirm(`${user.name}님에게 월정 쿠폰을 발급하시겠습니까?`)) return
    try {
      await api.post(`/api/coupon/issue/monthly/${user.no}`)
      alert('월정 쿠폰이 발급되었습니다.')
      loadCoupons()
    } catch {
      alert('쿠폰 발급에 실패했습니다.')
    }
  }

  const handleDelete = async (couponNo) => {
    if (!window.confirm('이 쿠폰을 삭제하시겠습니까?')) return
    try {
      await api.delete(`/api/coupon/delete/${couponNo}`)
      alert('쿠폰이 삭제되었습니다.')
      loadCoupons()
    } catch {
      alert('쿠폰 삭제에 실패했습니다.')
    }
  }

  const availableCount = coupons.filter(c => !c.used).length

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
        
        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px' }}>
          <div>
            <h5 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>쿠폰 관리</h5>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0' }}>{user.name} ({user.email}) · 사용 가능 {availableCount}개</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
        </div>

        {/* 발급 버튼 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button onClick={handleIssueNew} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            🎟 신규가입 쿠폰 발급
          </button>
          <button onClick={handleIssueMonthly} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            📅 월정 쿠폰 발급
          </button>
        </div>

        {/* 쿠폰 목록 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#9ca3af' }}>불러오는 중...</div>
        ) : coupons.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#9ca3af' }}>발급된 쿠폰이 없습니다.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {coupons.map(coupon => (
              <div key={coupon.couponNo} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: '10px',
                border: coupon.used ? '1px dashed #d1d5db' : '1px solid #93c5fd',
                background: coupon.used ? '#f9fafb' : '#eff6ff',
                opacity: coupon.used ? 0.7 : 1,
              }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: coupon.used ? '#9ca3af' : '#2563eb' }}>
                    🎟 {(coupon.discountAmount || 0).toLocaleString()}원 할인
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{coupon.couponName}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                    만료일: {coupon.expiredAt ? new Date(coupon.expiredAt).toLocaleDateString() : '-'}
                    {coupon.used && <span style={{ marginLeft: '8px', color: '#ef4444' }}>· 사용완료</span>}
                  </div>
                </div>
                <button onClick={() => handleDelete(coupon.couponNo)} style={{
                  padding: '5px 12px', borderRadius: '6px', border: '1px solid #fca5a5',
                  background: '#fff', color: '#ef4444', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap'
                }}>삭제</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================
// UserManage 메인
// ============================
const UserManage = () => {
  const [pageInfo, setPageInfo] = useState(null)
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null) // 쿠폰 모달용

  const loadUsers = () => {
    api.get(`/admin/usermanage?page=${page}&size=10`)
      .then(res => setPageInfo(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => { loadUsers() }, [page])

  const userList = pageInfo?.list || []

  const handleDelete = async (userId) => {
    if (!window.confirm('회원을 삭제하시겠습니까?')) return
    try {
      await api.delete(`/admin/user/delete/${userId}`)
      alert('회원이 삭제되었습니다.')
      loadUsers()
    } catch {
      alert('회원 삭제에 실패했습니다.')
    }
  }

  return (
    <div style={common.page}>
      <Sidebar />
      <main style={common.main}>
        <header style={common.header}>회원 관리</header>
        <section style={common.section}>

          <div style={{ ...common.card, padding: '12px 20px', marginBottom: '8px' }}>
            <div style={styles.headerRow}>
              <div style={styles.col}>이름</div>
              <div style={styles.col}>이메일</div>
              <div style={styles.col}>전화번호</div>
              <div style={styles.col}>등록일자</div>
              <div style={styles.col}>쿠폰</div>
              <div style={styles.col}>관리</div>
            </div>
          </div>

          <div style={common.card}>
            {userList.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>
                등록된 회원이 없습니다.
              </div>
            ) : (
              userList.map((user, idx) => (
                <div key={user.no || idx} style={{
                  ...styles.row,
                  borderBottom: idx < userList.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}>
                  <div style={styles.col}>{user.name}</div>
                  <div style={styles.col}>{user.email}</div>
                  <div style={styles.col}>{user.phone}</div>
                  <div style={styles.col}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleString('ko-KR') : '-'}
                  </div>
                  <div style={styles.col}>
                    <button
                      style={{ ...common.btnOutline, fontSize: '12px', padding: '4px 10px' }}
                      onClick={() => setSelectedUser(user)}
                    >
                      🎟 쿠폰 관리
                    </button>
                  </div>
                  <div style={styles.col}>
                    <button style={common.btnDanger} onClick={() => handleDelete(user.no)}>
                      삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <Pagination pageInfo={pageInfo} onPageChange={setPage} />

        </section>
      </main>

      {/* 쿠폰 관리 모달 */}
      {selectedUser && (
        <CouponModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  )
}

const styles = {
  headerRow: { display: 'flex', textAlign: 'center', fontWeight: 600, color: '#6b7280' },
  row: { display: 'flex', alignItems: 'center', textAlign: 'center', padding: '10px 0' },
  col: { flex: 1, fontSize: '0.9rem' },
}

export default UserManage