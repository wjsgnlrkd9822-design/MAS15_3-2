import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function OAuth2Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token")

    if (token) {
      localStorage.setItem("token", token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    window.history.replaceState(null, null, "/")
    navigate("/")
  }, [navigate])

  return <div>로그인 처리 중...</div>
}