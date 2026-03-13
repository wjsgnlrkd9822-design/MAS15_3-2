import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './JoinForm.css'

const JoinForm = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    password: '',
    passwordCheck: '',
    name: '',
    address: '',
    detailAddress: '',
    birth: '',
    email: '',
    phone: '',
  })
  const [idChecked, setIdChecked] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'username') setIdChecked(false)
  }

  const handlePhone = (e) => {
    let number = e.target.value.replace(/\D/g, '')
    if (number.length > 3 && number.length <= 7) {
      number = number.replace(/(\d{3})(\d+)/, '$1-$2')
    } else if (number.length > 7) {
      number = number.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3')
    }
    setForm((prev) => ({ ...prev, phone: number }))
  }

  const checkId = async () => {
    if (!form.username.trim()) {
      alert('아이디를 입력해주세요')
      return false
    }
    try {
      const response = await fetch(`http://localhost:8080/api/users/check/${form.username}`)
      const isAvailable = await response.json()
      if (isAvailable) {
        alert('사용 가능한 아이디입니다.')
        setIdChecked(true)
        return true
      } else {
        alert('중복된 아이디입니다.')
        setIdChecked(false)
        return false
      }
    } catch (err) {
      alert('에러 내용: ' + err.message)
      return false
    }
  }

  const searchAddress = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setForm((prev) => ({ ...prev, address: data.roadAddress }))
      },
    }).open()
  }

  const submitForm = async () => {
    const { username, password, passwordCheck, name, email, phone, address, detailAddress, birth } = form
    if (!username || !password || !passwordCheck || !name || !email || !phone || !address || !detailAddress || !birth) {
      alert('모든 필드를 채워주세요.')
      return
    }
    if (password !== passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
    const isIdAvailable = await checkId()
    if (!isIdAvailable) return
    try {
      const response = await fetch('http://localhost:8080/api/users/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name, address, detailAddress, birth, email, phone }),
      })
      const result = await response.json()
      if (result.success) {
        alert('회원가입 완료! 로그인 페이지로 이동합니다.')
        navigate('/login')
      } else {
        alert('회원가입 실패: ' + result.message)
      }
    } catch {
      alert('서버 오류 발생')
    }
  }

  return (
    <section className="login-header">
      <div className="login-header-inner" style={{ maxWidth: '600px' }}>

        <h2 className="mt-5 mb-2">회원가입</h2>
        <p className="mb-5">계정을 만들어 시작하세요</p>

        <form style={{ textAlign: 'left' }}>

          {/* 아이디 + 중복확인 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <input
                type="text" id="username" name="username" placeholder=" "
                value={form.username} onChange={handleChange} autoFocus
              />
              <label htmlFor="username">아이디</label>
            </div>
            <button
              type="button"
              onClick={checkId}
              style={{
                padding: '0 16px', border: '1px solid #d1d5db', borderRadius: '8px',
                background: idChecked ? '#22c55e' : '#fff',
                color: idChecked ? '#fff' : '#374151',
                fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              {idChecked ? '✓ 확인됨' : '중복확인'}
            </button>
          </div>

          {/* 비밀번호 */}
          <div className="input-group">
            <input
              type="password" id="password" name="password" placeholder=" "
              value={form.password} onChange={handleChange}
            />
            <label htmlFor="password">비밀번호</label>
          </div>

          {/* 비밀번호 확인 */}
          <div className="input-group">
            <input
              type="password" id="passwordCheck" name="passwordCheck" placeholder=" "
              value={form.passwordCheck} onChange={handleChange}
            />
            <label htmlFor="passwordCheck">비밀번호 확인</label>
          </div>

          {/* 이름 */}
          <div className="input-group">
            <input
              type="text" id="name" name="name" placeholder=" "
              value={form.name} onChange={handleChange}
            />
            <label htmlFor="name">이름</label>
          </div>

          {/* 주소 + 검색 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <input
                type="text" id="address" name="address" placeholder=" "
                value={form.address} readOnly
              />
              <label htmlFor="address">주소</label>
            </div>
            <button
              type="button"
              onClick={searchAddress}
              style={{
                padding: '0 16px', border: '1px solid #d1d5db', borderRadius: '8px',
                background: '#fff', color: '#374151',
                fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              주소 검색
            </button>
          </div>

          {/* 상세주소 */}
          <div className="input-group">
            <input
              type="text" id="detailAddress" name="detailAddress" placeholder=" "
              value={form.detailAddress} onChange={handleChange}
            />
            <label htmlFor="detailAddress">상세주소</label>
          </div>

          {/* 생년월일 */}
          <div className="input-group">
            <input
              type="date" id="birth" name="birth"
              value={form.birth} onChange={handleChange}
            />
            <label htmlFor="birth" style={{ top: '6px', fontSize: '11px' }}>생년월일</label>
          </div>

          {/* 이메일 */}
          <div className="input-group">
            <input
              type="text" id="email" name="email" placeholder=" "
              value={form.email} onChange={handleChange}
            />
            <label htmlFor="email">이메일</label>
          </div>

          {/* 전화번호 */}
          <div className="input-group">
            <input
              type="text" id="phone" name="phone" placeholder=" "
              value={form.phone} onChange={handlePhone}
            />
            <label htmlFor="phone">전화번호</label>
          </div>

          {/* 버튼 */}
          <div className="grid gap-2" style={{ marginTop: '16px' }}>
            <button
              type="button"
              onClick={submitForm}
              className='w-full h-[42px] py-2.5 px-4 text-lg font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 cursor-pointer'
            >
              회원가입
            </button>
            <hr style={{ margin: '4px 0' }} />
            <div style={{ textAlign: 'center', fontSize: '14px' }}>
              <span className="no-count">이미 계정이 있으신가요?&nbsp;</span>
              <a className='text-blue-600 hover:text-blue-800 underline' href="/login">로그인</a>
            </div>
          </div>

        </form>
      </div>
    </section>
  )
}

export default JoinForm