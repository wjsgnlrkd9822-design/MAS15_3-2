import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

axios.defaults.baseURL = 'http://localhost:8080'

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: token } : {}
}

// JWT에서 userNo 파싱
function getUserNoFromToken() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    const base64 = token.replace('Bearer ', '').split('.')[1]
    const payload = JSON.parse(atob(base64))
    return payload.uno ? Number(payload.uno) : null
  } catch (e) { return null }
}

// ============================
// 1. 내 정보 섹션
// ============================
const UserSection = () => {
  const [editOpen, setEditOpen] = useState(false)
  const [info, setInfo] = useState(null)
  const [form, setForm] = useState({})

  useEffect(() => {
    axios.get('/api/users/select', { headers: getAuthHeader() })
      .then(res => { setInfo(res.data); setForm(res.data) })
      .catch(() => alert('정보를 불러오는 중 오류 발생. 로그인 상태를 확인하세요.'))
  }, [])

  const handleUpdate = async () => {
    try {
      await axios.put('/api/users/update', {
        username: info.username, email: form.email, phone: form.phone,
        birth: form.birth, address: form.address, detailAddress: form.detailAddress
      }, { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } })
      setInfo(prev => ({ ...prev, ...form }))
      setEditOpen(false)
      alert('정보가 수정되었습니다.')
    } catch { alert('수정 중 오류가 발생했습니다.') }
  }

  const handleDelete = async () => {
    if (!window.confirm('정말로 회원 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) return
    try {
      const res = await axios.delete('/api/users/delete', { headers: getAuthHeader() })
      if (res.data.success) {
        alert(res.data.message || '회원 탈퇴가 완료되었습니다.')
        localStorage.removeItem('token')
        window.location.href = '/'
      } else { alert('회원 탈퇴 실패: ' + (res.data.message || '알 수 없음')) }
    } catch { alert('서버 오류가 발생했습니다.') }
  }

  const handlePhone = (e) => {
    let v = e.target.value.replace(/\D/g, '')
    if (v.length > 3 && v.length <= 7) v = v.replace(/(\d{3})(\d+)/, '$1-$2')
    else if (v.length > 7) v = v.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3')
    setForm(f => ({ ...f, phone: v }))
  }

  const searchAddress = () => {
    new window.daum.Postcode({ oncomplete: (data) => setForm(f => ({ ...f, address: data.roadAddress })) }).open()
  }

  const fields = [
    { icon: '👤', label: '아이디', key: 'username' },
    { icon: '🪪', label: '이름', key: 'name' },
    { icon: '🎂', label: '생년월일', key: 'birth' },
    { icon: '✉️', label: '이메일', key: 'email' },
    { icon: '📞', label: '전화번호', key: 'phone' },
    { icon: '📍', label: '주소', key: 'address' },
    { icon: '🏠', label: '상세주소', key: 'detailAddress' },
  ]

  if (!info) return <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>불러오는 중...</div>

  return (
    <section style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
      <div style={{ width: '100%', maxWidth: '1000px', padding: '32px 40px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,.05), 0 10px 20px rgba(0,0,0,.08)' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>내 정보</h3>
        <ul style={{ listStyle: 'none', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
          {fields.map((f, i) => (
            <li key={f.key} style={{ padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center', borderBottom: i < fields.length - 1 ? '1px solid #e5e7eb' : 'none', fontSize: '14px', color: '#111827' }}>
              <span>{f.icon}</span>
              <span style={{ color: '#6b7280', width: '80px' }}>{f.label}</span>
              <span style={{ fontWeight: 500 }}>{info[f.key]}</span>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setForm({ ...info }); setEditOpen(true) }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: '14px' }}>정보 수정</button>
          <button onClick={handleDelete} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fff', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}>회원 탈퇴</button>
        </div>
      </div>
      {editOpen && (
        <div onClick={() => setEditOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '480px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px' }}>
              <h5 style={{ fontSize: '18px', fontWeight: 600 }}>내 정보 수정</h5>
              <button onClick={() => setEditOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>
            {[
              { label: '아이디(변경불가)', key: 'username', readOnly: true },
              { label: '이름(변경불가)', key: 'name', readOnly: true },
              { label: '이메일', key: 'email' },
              { label: '전화번호', key: 'phone' },
              { label: '생년월일', key: 'birth', type: 'date' },
            ].map(({ label, key, readOnly, type }) => (
              <div key={key} style={{ marginBottom: '12px' }}>
                <label style={{ fontWeight: 500, fontSize: '14px', display: 'block', marginBottom: '4px' }}>{label}</label>
                <input type={type || 'text'} value={form[key] || ''} readOnly={readOnly}
                  onChange={key === 'phone' ? handlePhone : e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: readOnly ? '#f9fafb' : '#fff', color: readOnly ? '#9ca3af' : '#111827' }} />
              </div>
            ))}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontWeight: 500, fontSize: '14px', display: 'block', marginBottom: '4px' }}>주소</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={form.address || ''} readOnly style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: '#f9fafb', color: '#9ca3af' }} />
                <button onClick={searchAddress} style={{ padding: '8px 14px', border: '1px solid #d1d5db', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' }}>주소 검색</button>
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontWeight: 500, fontSize: '14px', display: 'block', marginBottom: '4px' }}>상세주소</label>
              <input value={form.detailAddress || ''} onChange={e => setForm(f => ({ ...f, detailAddress: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
              <button onClick={() => setEditOpen(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#e5e7eb', cursor: 'pointer', fontSize: '14px' }}>취소</button>
              <button onClick={handleUpdate} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>수정</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

// ============================
// NEW: 등급 & 쿠폰 섹션
// ============================
const gradeInfo = {   // ← 이거 추가!
  NEW_USER: { label: '신규회원', color: '#6b7280', bg: '#f3f4f6', emoji: '🌱' },
  BRONZE: { label: 'BRONZE', color: '#92400e', bg: '#fef3c7', emoji: '🥉' },
  SILVER: { label: 'SILVER', color: '#475569', bg: '#f1f5f9', emoji: '🥈' },
  GOLD: { label: 'GOLD', color: '#b45309', bg: '#fffbeb', emoji: '🥇' },
  VIP: { label: 'VIP', color: '#7c3aed', bg: '#f5f3ff', emoji: '👑' },
}
const gradeNextInfo = {
  NEW_USER: '첫 결제 후 등급이 부여됩니다',
  BRONZE: '누적 30만원 달성 시 SILVER 승급',
  SILVER: '누적 70만원 달성 시 GOLD 승급',
  GOLD: '누적 150만원 달성 시 VIP 승급',
  VIP: '최고 등급입니다! 🎉',
}

const GradeCouponSection = () => {
  const [grade, setGrade] = useState(null)
  const [coupons, setCoupons] = useState([])
  const [tab, setTab] = useState('available') // 'available' | 'all'
  const userNo = getUserNoFromToken()

  const availableCoupons = coupons.filter(c => !c.used)
  const displayCoupons = tab === 'available' ? availableCoupons : coupons
  const gradeStyle = grade ? (gradeInfo[grade.grade] || gradeInfo['BRONZE']) : null
useEffect(() => {
    if (!userNo) return

    // 등급 재계산 후 조회
    axios.post(`/api/coupon/grade/recalc/${userNo}`, {}, { headers: getAuthHeader() })
      .finally(() => {
        axios.get(`/api/coupon/grade/${userNo}`, { headers: getAuthHeader() })
          .then(res => setGrade(res.data))
          .catch(() => { })
      })

    // 쿠폰 조회
    axios.get(`/api/coupon/all/${userNo}`, { headers: getAuthHeader() })
      .then(res => setCoupons(res.data))
      .catch(() => { })
}, [userNo])

  return (
    <section style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
      <div style={{ width: '100%', maxWidth: '1000px', padding: '32px 40px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,.05), 0 10px 20px rgba(0,0,0,.08)' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px', color: '#111827' }}>등급 & 쿠폰</h3>

        {/* 등급 카드 */}
        {grade && gradeStyle && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 24px', background: gradeStyle.bg, borderRadius: '12px', marginBottom: '24px', border: `1px solid ${gradeStyle.color}30` }}>
            <div style={{ fontSize: '48px' }}>{gradeStyle.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{ fontSize: '22px', fontWeight: 700, color: gradeStyle.color }}>{gradeStyle.label}</span>
                <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: gradeStyle.color, color: '#fff' }}>현재 등급</span>
              </div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>누적 결제금액: <strong>{(grade.totalAmount || 0).toLocaleString()}원</strong></p>
              <p style={{ fontSize: '13px', color: gradeStyle.color, marginTop: '4px' }}>{gradeNextInfo[grade.grade]}</p>
            </div>
            <div style={{ textAlign: 'center', padding: '12px 20px', background: '#fff', borderRadius: '10px', border: `1px solid ${gradeStyle.color}40` }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: gradeStyle.color }}>{availableCoupons.length}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>사용 가능 쿠폰</div>
            </div>
          </div>
        )}

        {/* 쿠폰 탭 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button onClick={() => setTab('available')} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, background: tab === 'available' ? '#3b82f6' : '#f3f4f6', color: tab === 'available' ? '#fff' : '#6b7280' }}>
            사용 가능 ({availableCoupons.length})
          </button>
          <button onClick={() => setTab('all')} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, background: tab === 'all' ? '#3b82f6' : '#f3f4f6', color: tab === 'all' ? '#fff' : '#6b7280' }}>
            전체 ({coupons.length})
          </button>
        </div>

        {/* 쿠폰 목록 */}
        {displayCoupons.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '30px 0', color: '#9ca3af' }}>
            {tab === 'available' ? '사용 가능한 쿠폰이 없습니다.' : '쿠폰 내역이 없습니다.'}
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {displayCoupons.map(coupon => (
              <div key={coupon.couponNo} style={{
                padding: '16px 20px', borderRadius: '12px', position: 'relative',
                border: coupon.used ? '1px dashed #d1d5db' : '1px solid #93c5fd',
                background: coupon.used ? '#f9fafb' : '#eff6ff',
                opacity: coupon.used ? 0.6 : 1,
              }}>
                {coupon.used && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, background: '#e5e7eb', color: '#9ca3af' }}>사용완료</div>
                )}
                <div style={{ fontSize: '20px', fontWeight: 700, color: coupon.used ? '#9ca3af' : '#2563eb', marginBottom: '4px' }}>
                  🎟 {(coupon.discountAmount || 0).toLocaleString()}원 할인
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>{coupon.couponName}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  만료일: {coupon.expiredAt ? new Date(coupon.expiredAt).toLocaleDateString() : '-'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ============================
// 2. 반려견 모달 (공통)
// ============================
const defaultPetForm = {
  name: '', species: '', age: '', size: '소형', weight: '',
  gender: '수컷', neutered: '예', vaccination: '예', etc: ''
}

const PetModal = ({ title, form, setForm, onSubmit, onClose, onDelete, submitLabel, preview, setPreview, fileRef }) => {
  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }
  const selectStyle = { ...inputStyle, background: '#fff' }
  const labelStyle = { fontWeight: 500, fontSize: '14px', display: 'block', marginBottom: '4px' }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflowY: 'auto' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '600px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px' }}>
          <h5 style={{ fontSize: '18px', fontWeight: 600 }}>{title}</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
        </div>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>이름</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>종</label>
              <input value={form.species} onChange={e => setForm(f => ({ ...f, species: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div onClick={() => fileRef.current?.click()} style={{ width: '150px', height: '150px', border: '2px dashed #a0aec0', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
              {preview ? <img src={preview} alt="미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '12px', color: '#a0aec0', textAlign: 'center' }}>클릭하여<br />이미지 선택</span>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" name="profileImg" style={{ display: 'none' }} onChange={handleImage} />
            <label style={{ fontSize: '13px', color: '#6b7280' }}>프로필 이미지</label>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div><label style={labelStyle}>나이</label><input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} style={inputStyle} /></div>
          <div><label style={labelStyle}>크기</label><select value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} style={selectStyle}>{['소형', '중형', '대형'].map(o => <option key={o} value={o}>{o}</option>)}</select></div>
          <div><label style={labelStyle}>몸무게(kg)</label><input type="number" step="0.1" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} style={inputStyle} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div><label style={labelStyle}>성별</label><select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} style={selectStyle}>{['수컷', '암컷'].map(o => <option key={o} value={o}>{o}</option>)}</select></div>
          <div><label style={labelStyle}>중성화 여부</label><select value={form.neutered} onChange={e => setForm(f => ({ ...f, neutered: e.target.value }))} style={selectStyle}>{['예', '아니오'].map(o => <option key={o} value={o}>{o}</option>)}</select></div>
          <div><label style={labelStyle}>예방접종 여부</label><select value={form.vaccination} onChange={e => setForm(f => ({ ...f, vaccination: e.target.value }))} style={selectStyle}>{['예', '아니오'].map(o => <option key={o} value={o}>{o}</option>)}</select></div>
        </div>
        <div style={{ marginBottom: '12px' }}><label style={labelStyle}>건강 증명서</label><input type="file" name="certificateFile" style={{ width: '100%', fontSize: '14px' }} /></div>
        <div style={{ marginBottom: '16px' }}><label style={labelStyle}>기타 사항</label><textarea value={form.etc} onChange={e => setForm(f => ({ ...f, etc: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'none' }} /></div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
          {onDelete && <button onClick={onDelete} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fff', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}>삭제</button>}
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#e5e7eb', cursor: 'pointer', fontSize: '14px' }}>취소</button>
          <button onClick={onSubmit} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>{submitLabel}</button>
        </div>
      </div>
    </div>
  )
}

// ============================
// 3. 반려견 섹션
// ============================
const PetSection = () => {
  const [pets, setPets] = useState([])
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState(defaultPetForm)
  const [editPetNo, setEditPetNo] = useState(null)
  const [preview, setPreview] = useState('')
  const fileRef = useRef(null)

  const loadPets = async () => {
    try {
      const res = await axios.get('/api/pets/list', { headers: getAuthHeader() })
      setPets(res.data.pets || [])
    } catch { alert('반려견 목록을 불러오지 못했습니다.') }
  }

  useEffect(() => { loadPets() }, [])

  const openAdd = () => { setForm(defaultPetForm); setPreview(''); if (fileRef.current) fileRef.current.value = ''; setAddOpen(true) }

  const openEdit = async (petNo) => {
    try {
      const res = await axios.get(`/api/pets/${petNo}`, { headers: getAuthHeader() })
      setForm(res.data); setEditPetNo(petNo)
      setPreview(`http://localhost:8080/api/pets/image/${petNo}`)
      if (fileRef.current) fileRef.current.value = ''
      setEditOpen(true)
    } catch { alert('반려견 정보를 불러오지 못했습니다.') }
  }

  const buildFormData = () => {
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (fileRef.current?.files[0]) fd.append('profileImg', fileRef.current.files[0])
    return fd
  }

  const handleAdd = async () => {
    try { await axios.post('/api/pets/add', buildFormData(), { headers: getAuthHeader() }); alert('반려견이 등록되었습니다.'); setAddOpen(false); loadPets() }
    catch { alert('반려견 등록 실패') }
  }

  const handleEdit = async () => {
    const fd = buildFormData(); fd.append('petNo', editPetNo)
    try { await axios.post('/api/pets/update', fd, { headers: getAuthHeader() }); alert('반려견 정보가 수정되었습니다.'); setEditOpen(false); loadPets() /* onPetUpdate() */ }
    catch { alert('반려견 수정 실패') }
  }

  const handleDelete = async () => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return
    try { await axios.delete(`/api/pets/delete/${editPetNo}`, { headers: getAuthHeader() }); alert('반려견이 삭제되었습니다.'); setEditOpen(false); loadPets() }
    catch { alert('반려견 삭제 실패') }
  }

  return (
    <section style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
      <div style={{ width: '100%', maxWidth: '1000px', padding: '32px 40px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,.05), 0 10px 20px rgba(0,0,0,.08)' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>나의 반려견</h3>
        {pets.length === 0
          ? <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>등록된 반려견이 없습니다.</p>
          : pets.map(pet => (
            <div key={pet.no} style={{ display: 'flex', alignItems: 'center', padding: '24px', border: '1px solid #d1d5db', borderRadius: '16px', marginBottom: '12px', boxShadow: '0 4px 6px rgba(0,0,0,.05)' }}>
              <div style={{ marginRight: '30px' }}>
                <img src={`http://localhost:8080/api/pets/image/${pet.no}`} alt={pet.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d1d5db' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '20px', fontWeight: 700 }}>{pet.name}</span>
                <span style={{ fontSize: '14px' }}>{pet.species} {pet.size}견 {pet.gender === '수컷' ? '♂' : '♀'}</span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>{pet.age}살 · {pet.weight}kg</span>
              </div>
              <button onClick={() => openEdit(pet.no)} style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: '14px' }}>수정하기</button>
            </div>
          ))
        }
        <button onClick={openAdd} style={{ width: '100%', padding: '20px', border: '2px dashed #6b7280', borderRadius: '16px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '16px', fontWeight: 600, color: '#6b7280', opacity: 0.6, marginTop: '8px' }}>
          <span style={{ fontSize: '24px' }}>＋</span><span>반려견 추가</span>
        </button>
      </div>
      {addOpen && <PetModal title="반려견 추가" form={form} setForm={setForm} onSubmit={handleAdd} onClose={() => setAddOpen(false)} submitLabel="추가" preview={preview} setPreview={setPreview} fileRef={fileRef} />}
      {editOpen && <PetModal title="반려견 정보 수정" form={form} setForm={setForm} onSubmit={handleEdit} onClose={() => setEditOpen(false)} onDelete={handleDelete} submitLabel="수정 완료" preview={preview} setPreview={setPreview} fileRef={fileRef} />}
    </section>
  )
}

// ============================
// 4. 예약 조회 모달
// ============================
const ViewModal = ({ resNo, onClose }) => {
  const [detail, setDetail] = useState(null)
  const [room, setRoom] = useState(null)
  const [services, setServices] = useState([])

  useEffect(() => {
    Promise.all([
      axios.get(`/api/reservation/${resNo}`, { headers: getAuthHeader() }),
      axios.get('/api/rooms/services', { headers: getAuthHeader() })
    ]).then(([resData, resServices]) => {
      setDetail(resData.data); setServices(resServices.data)
      axios.get(`/api/rooms/${resData.data.roomNo}`, { headers: getAuthHeader() })
           .then(r => setRoom(r.data.room))
    })
  }, [resNo])

  if (!detail || !room) return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '32px' }}>불러오는 중...</div>
    </div>
  )

  const nights = Math.max(0, Math.ceil((new Date(detail.checkout) - new Date(detail.checkin)) / 86400000))
  const selectedSvcs = services.filter(s => detail.serviceIds?.some(id => String(id) === String(s.serviceNo)))
  const svcTotal = selectedSvcs.reduce((a, s) => a + s.price, 0)
  const total = nights * room.roomPrice + svcTotal
  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: '#f9fafb' }
  const labelStyle = { fontWeight: 500, fontSize: '14px', display: 'block', marginBottom: '4px' }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px' }}>
          <h5 style={{ fontSize: '18px', fontWeight: 600 }}>예약 상세 정보</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
        </div>
        {room.img && <img src={`http://localhost:8080/uploads/${room.img}`} alt="객실" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />}
        <div style={{ marginBottom: '12px' }}><label style={labelStyle}>객실 정보</label><input value={room.roomType} readOnly style={inputStyle} /></div>
        <div style={{ marginBottom: '12px' }}><label style={labelStyle}>반려견 이름</label><input value={detail.petName} readOnly style={inputStyle} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div><label style={labelStyle}>체크인</label><input value={detail.checkin} readOnly style={inputStyle} /></div>
          <div><label style={labelStyle}>체크아웃</label><input value={detail.checkout} readOnly style={inputStyle} /></div>
          <div><label style={labelStyle}>박 수</label><input value={`${nights}박`} readOnly style={inputStyle} /></div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>선택 서비스</label>
          {selectedSvcs.length === 0
            ? <p style={{ fontSize: '14px', color: '#9ca3af' }}>선택한 서비스 없음</p>
            : selectedSvcs.map(s => (
              <div key={s.serviceNo} style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '4px', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{s.serviceName}</span><span style={{ color: '#6b7280' }}>{s.price.toLocaleString()}원</span>
              </div>
            ))
          }
        </div>
        <div style={{ marginBottom: '12px' }}><label style={labelStyle}>총 금액</label><input value={`${total.toLocaleString()}원`} readOnly style={{ ...inputStyle, fontWeight: 700 }} /></div>
        <div style={{ marginBottom: '16px' }}><label style={labelStyle}>상태</label><input value={detail.status} readOnly style={inputStyle} /></div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#e5e7eb', cursor: 'pointer', fontSize: '14px' }}>닫기</button>
        </div>
      </div>
    </div>
  )
}

// ============================
// 5. 예약 수정 모달
// ============================
const EditReservationModal = ({ resNo, onClose, onRefresh }) => {
  const [detail, setDetail] = useState(null)
  const [room, setRoom] = useState(null)
  const [allServices, setAllServices] = useState([])
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')
  const [selectedSvcIds, setSelectedSvcIds] = useState([])

  useEffect(() => {
    Promise.all([
      axios.get(`/api/reservation/${resNo}`, { headers: getAuthHeader() }),
      axios.get('/api/rooms/services', { headers: getAuthHeader() })
    ]).then(([resData, resServices]) => {
      const d = resData.data
      setDetail(d); setCheckin(d.checkin); setCheckout(d.checkout)
      setSelectedSvcIds((d.serviceIds || []).map(String)); setAllServices(resServices.data)
      axios.get(`/api/rooms/${d.roomNo}`, { headers: getAuthHeader() }).then(r => setRoom(r.data.room))
    })
  }, [resNo])

  if (!detail || !room) return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '32px' }}>불러오는 중...</div>
    </div>
  )

  const nights = Math.max(0, Math.ceil((new Date(checkout) - new Date(checkin)) / 86400000))
  const svcTotal = allServices.filter(s => selectedSvcIds.includes(String(s.serviceNo))).reduce((a, s) => a + s.price, 0)
  const total = nights * room.roomPrice + svcTotal
  const today = new Date().toISOString().split('T')[0]
  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }
  const labelStyle = { fontWeight: 500, fontSize: '14px', display: 'block', marginBottom: '4px' }
  const toggleService = (id) => { const sid = String(id); setSelectedSvcIds(prev => prev.includes(sid) ? prev.filter(s => s !== sid) : [...prev, sid]) }

  const handleUpdate = async () => {
    const fd = new FormData()
    fd.append('checkin', checkin); fd.append('checkout', checkout); fd.append('total', nights)
    fd.append('totalPrice', total); fd.append('roomNo', detail.roomNo)
    selectedSvcIds.forEach(id => fd.append('serviceIds', id))
    try {
      const res = await axios.post(`/api/reservation/update/${resNo}`, fd, { headers: getAuthHeader() })
      alert(res.data.message)
      if (res.data.success) { onClose(); onRefresh() }
    } catch { alert('예약 수정 중 오류가 발생했습니다.') }
  }

  const handleDelete = async () => {
    if (!window.confirm('정말 이 예약을 삭제하시겠습니까?')) return
    try {
      const res = await axios.delete(`/api/reservation/delete/${resNo}`, { headers: getAuthHeader() })
      alert(res.data.message)
      if (res.data.success) { onClose(); onRefresh() }
    } catch { alert('삭제 중 오류가 발생했습니다.') }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px' }}>
          <h5 style={{ fontSize: '18px', fontWeight: 600 }}>예약 수정</h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
        </div>
        {room.img && <img src={`http://localhost:8080/uploads/${room.img}`} alt="객실" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />}
        <div style={{ marginBottom: '12px' }}><label style={labelStyle}>객실 정보</label><input value={room.roomType} readOnly style={{ ...inputStyle, background: '#f9fafb' }} /></div>
        <div style={{ marginBottom: '12px' }}><label style={labelStyle}>반려견 이름</label><input value={detail.petName} readOnly style={{ ...inputStyle, background: '#f9fafb' }} /></div>
        <div style={{ marginBottom: '12px' }}><label style={labelStyle}>1박 가격</label><input value={`${room.roomPrice.toLocaleString()}원`} readOnly style={{ ...inputStyle, background: '#f9fafb' }} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div><label style={labelStyle}>체크인</label><input type="date" value={checkin} min={today} onChange={e => setCheckin(e.target.value)} style={inputStyle} /></div>
          <div><label style={labelStyle}>체크아웃</label><input type="date" value={checkout} min={checkin || today} onChange={e => setCheckout(e.target.value)} style={inputStyle} /></div>
          <div><label style={labelStyle}>박 수</label><input value={`${nights}박`} readOnly style={{ ...inputStyle, background: '#f9fafb' }} /></div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>선택 서비스</label>
          {allServices.map(s => {
            const checked = selectedSvcIds.includes(String(s.serviceNo))
            return (
              <label key={s.serviceNo} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', border: `1px solid ${checked ? '#93c5fd' : '#e5e7eb'}`, borderRadius: '8px', marginBottom: '6px', cursor: 'pointer', background: checked ? '#eff6ff' : '#fff', fontSize: '14px' }}>
                <input type="checkbox" checked={checked} onChange={() => toggleService(s.serviceNo)} style={{ accentColor: '#3b82f6' }} />
                <span style={{ flex: 1 }}>{s.serviceName}</span>
                <span style={{ color: '#6b7280' }}>{s.price.toLocaleString()}원</span>
              </label>
            )
          })}
        </div>
        <div style={{ marginBottom: '16px' }}><label style={labelStyle}>총 금액</label><input value={`${total.toLocaleString()}원`} readOnly style={{ ...inputStyle, background: '#f9fafb', fontWeight: 700 }} /></div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
          <button onClick={handleDelete} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fff', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}>삭제</button>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#e5e7eb', cursor: 'pointer', fontSize: '14px' }}>취소</button>
          <button onClick={handleUpdate} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>수정 완료</button>
        </div>
      </div>
    </div>
  )
}

// ============================
// 6. 예약 섹션
// ============================
const ReservationSection = ( { refreshKey }) => {
  useEffect(() => { loadReservations() }, [refreshKey])
  const [reservations, setReservations] = useState([])
  const [viewResNo, setViewResNo] = useState(null)
  const [editResNo, setEditResNo] = useState(null)

  const loadReservations = async () => {
    try {
      const res = await axios.get('/api/reservations/my', { headers: getAuthHeader() })
      setReservations(res.data.reservations || [])
    } catch { alert('예약 내역을 불러오지 못했습니다.') }
  }

  useEffect(() => { loadReservations() }, [])

  const handlePay = (resNo, totalPrice) => {
    const w = 500, h = 650
    const left = (screen.width - w) / 2, top = (screen.height - h) / 2
    window.open('', 'kakaopayPopup', `width=${w},height=${h},left=${left},top=${top},scrollbars=yes`)
    const form = document.createElement('form')
    form.method = 'POST'; form.action = 'http://localhost:8080/kakaopay/ready'; form.target = 'kakaopayPopup'
    form.innerHTML = `<input type="hidden" name="resNo" value="${resNo}"><input type="hidden" name="totalPrice" value="${totalPrice}">`
    document.body.appendChild(form); form.submit(); document.body.removeChild(form)
  }

  const handleRefund = (resNo, totalPrice) => {
    if (!window.confirm('정말 환불하시겠습니까?')) return
    const form = document.createElement('form')
    form.method = 'POST'; form.action = 'http://localhost:8080/kakaopay/refund'
    form.innerHTML = `<input type="hidden" name="resNo" value="${resNo}"><input type="hidden" name="cancelAmount" value="${totalPrice}">`
    document.body.appendChild(form); form.submit(); document.body.removeChild(form)
  }

  const statusStyle = (status) => {
    if (status === '예약중') return { background: '#dbeafe', color: '#1d4ed8' }
    if (status === '결제완료') return { background: '#dcfce7', color: '#15803d' }
    if (status === '환불') return { background: '#f3f4f6', color: '#9ca3af' }
    return { background: '#f3f4f6', color: '#6b7280' }
  }

  return (
    <section style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
      <div style={{ width: '100%', maxWidth: '1000px', padding: '32px 40px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,.05), 0 10px 20px rgba(0,0,0,.08)' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>호텔 예약 내역</h3>
        {reservations.length === 0
          ? <p style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>예약한 내역이 없습니다.</p>
          : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: '#f3f4f6', fontSize: '13px', color: '#374151' }}>
                    {['예약번호', '반려견', '체크인', '체크아웃', '총금액', '상태', '관리', '결제'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reservations.map(res => (
                    <tr key={res.resNo} onClick={() => setViewResNo(res.resNo)}
                      style={{ cursor: 'pointer', fontSize: '14px', background: res.status === '환불' ? '#f9fafb' : '#fff', color: res.status === '환불' ? '#9ca3af' : '#111827', borderTop: '1px solid #f3f4f6' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background = res.status === '환불' ? '#f9fafb' : '#fff'}
                    >
                      <td style={{ padding: '12px 16px' }}>{res.resNo}</td>
                      <td style={{ padding: '12px 16px' }}>{res.petName}</td>
                      <td style={{ padding: '12px 16px' }}>{res.checkin}</td>
                      <td style={{ padding: '12px 16px' }}>{res.checkout}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{res.totalPrice?.toLocaleString()}원</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ ...statusStyle(res.status), padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{res.status}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                        {res.status === '예약중' && <button onClick={() => setEditResNo(res.resNo)} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>수정</button>}
                      </td>
                      <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                        {res.status === '예약중' && <button onClick={() => handlePay(res.resNo, res.totalPrice)} style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', background: '#f59e0b', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>결제</button>}
                        {res.status === '결제완료' && <button onClick={() => handleRefund(res.resNo, res.totalPrice)} style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>환불</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
      {viewResNo && <ViewModal resNo={viewResNo} onClose={() => setViewResNo(null)} />}
      {editResNo && <EditReservationModal resNo={editResNo} onClose={() => setEditResNo(null)} onRefresh={loadReservations} />}
    </section>
  )
}

// ============================
// MypageForm (최상단 조합)
// ============================
const MypageForm = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey( k => k + 1)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { alert('로그인이 필요합니다.'); window.location.href = '/login' }
  }, [])

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', fontFamily: "'Noto Sans KR', system-ui, sans-serif" }}>
      <section style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
        <div style={{ width: '100%', maxWidth: '1000px', padding: '32px 40px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,.05), 0 10px 20px rgba(0,0,0,.08)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>마이 페이지</h2>
          <p style={{ fontSize: '15px', color: '#6b7280' }}>나의 예약 내역과 정보를 확인하고 관리하세요</p>
        </div>
      </section>
      <UserSection />
      <GradeCouponSection />
      <PetSection />
      <ReservationSection />
    </div>
  )
}

export default MypageForm