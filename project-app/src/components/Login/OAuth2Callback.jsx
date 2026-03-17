import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OAuth2Callback() {
  const navigate = useNavigate()

  useEffect(() => {
  const token = new URLSearchParams(window.location.search).get("token")

  if (token) {
    localStorage.setItem("token", token)
  }

  navigate("/")
}, [])

  return <div>로그인 처리 중...</div>
}