import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginForm.css'

const LoginForm = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberId, setRememberId] = useState(false)
  const [autoLogin, setAutoLogin] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log('handleLogin 실행됨')
    console.log('username', username)
    console.log('password', password)
    setError('')
    setSuccess('')

    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
        credentials: 'include',
      })

      if (response.ok) {
        const token = response.headers.get('Authorization')
        if (token) {
          localStorage.setItem('token', token)
        }

        if (rememberId) localStorage.setItem('savedUsername', username)
        else localStorage.removeItem('savedUsername')

        if (autoLogin) localStorage.setItem('autoLogin', 'true')
          else localStorage.removeItem('autoLogin')

        navigate('/')
      } else {
        setError('아이디 또는 비밀번호를 잘못 입력했습니다.')
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.')
    }
  }

  React.useEffect(() => {
    const saved = localStorage.getItem('savedUsername')
    if (saved) {
      setUsername(saved)
      setRememberId(true)
      setAutoLogin(true)
    }
    const params = new URLSearchParams(window.location.search)
    if (params.get('logout')) setSuccess('정상적으로 로그아웃 되었습니다.')
  }, [])

  return (
    <section className="login-header">
      <div className="login-header-inner">

        <h2 className="mt-5 mb-2">로그인</h2>
        <p className="mb-5">계정에 로그인하여 계속하세요</p>

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>

          <div className="input-group">
            <input
              type="text"
              id="username"
              name="username"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="username">아이디</label>
          </div>

          <div className='input-group'>
            <input
              type='password'
              id='password'
              name='password'
              placeholder=' '
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor='password'>비밀번호</label>
          </div>

          <div className='check-box-header'>
            <label className='check-box-label'>
              <input
                className='check-box-form'
                type="checkbox"
                checked={rememberId}
                onChange={(e) => setRememberId(e.target.checked)}
              />
              &nbsp;아이디 저장
            </label>
            <label className='check'>
              <input
                className='check-box-form'
                type="checkbox"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
              />
              &nbsp;자동 로그인
            </label>
          </div>

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.successMsg}>{success}</p>}

          <div className="grid gap-2 flex justify-center">
            <button type="submit"
                    className='w-full h-[42px] py-2.5 px-4 text-lg font-semibold 
                    text-white bg-gray-900 rounded-lg hover:bg-gray-800 
                    rounded shadow cursor-pointer '
            >로그인</button>

            <hr style={{ margin: '4px 0' }} />

            <a href="http://localhost:8080/oauth2/authorization/kakao">
              <img
                src="/img/kakao_login_medium_wide.png"
                alt="카카오 로그인"
                style={{ height: "45px", width: "auto"}}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </a>
            <a href="http://localhost:8080/oauth2/authorization/google">
              <img
                src="/img/web_light_sq_SI@4x.png"
                alt="구글 로그인"
                style={{ height: "45px", width: "auto"}}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </a>
            <a href="http://localhost:8080/oauth2/authorization/naver">
                  <img
                src="/img/NAVER_login_Light_KR_white_wide_H48.png"
                alt="네이버 로그인"
                style={{ height: "45px", width: "auto"}}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </a>


            <div style={styles.links}>
              <span className="no-count">계정이 없으신가요?</span>
              <a className='text-blue-600 hover:text-blue-800 underline' href="/join">회원가입</a>
            </div>

            <div style={{ textAlign: 'center' }}>
              <a href="/find" className='text-blue-600 hover:text-blue-800 underline'>아이디/비밀번호 찾기</a>
            </div>
          </div>

        </form>
      </div>
    </section>
  )
}

const styles = {
  error: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '8px',
  },
  successMsg: {
    color: '#22c55e',
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '8px',
  },
  links: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '16px',
  },
  link: {
    color: '#333',
    textDecoration: 'underline',
  },
}

export default LoginForm