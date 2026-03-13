import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:8080',
})

// 요청마다 토큰 자동으로 헤더에 담기
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers['Authorization'] = token // Bearer 포함되어 있음
    }
    return config
})

// 응답 에러 처리
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        if (error.response?.status === 403) {
            alert('접근 권한이 없습니다.')
        }
        return Promise.reject(error)
    }
)

export default instance