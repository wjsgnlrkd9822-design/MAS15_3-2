import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { common } from './adminStyles'
import api from '../../api/api'

const Notice = () => {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const handleSubmit = async () => {
        if (!title.trim()) { alert('제목을 입력해주세요.'); return }
        if (!content.trim()) { alert('내용을 입력해주세요.'); return }
        try {
            await api.post('/admin/noticeadd', { title, content })
            alert('공지사항이 등록되었습니다.')
            navigate('/admin/notice')
        } catch {
            alert('서버 통신 오류')
        }
    }

    return (
        <div style={common.page}>
            <Sidebar />
            <main style={common.main}>
                <header style={common.header}>공지사항 작성</header>
                <section style={common.section}>
                    <div style={common.card}>
                        <div style={common.formGroup}>
                            <label style={common.label}>제목</label>
                            <input
                                style={common.input}
                                type="text"
                                placeholder="공지사항 제목을 입력하세요"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>
                        <div style={common.formGroup}>
                            <label style={common.label}>내용</label>
                            <textarea
                                style={{ ...common.input, height: '200px', resize: 'vertical' }}
                                placeholder="공지사항 내용을 입력하세요"
                                value={content}
                                onChange={e => setContent(e.target.value)}
                            />
                        </div>
                        <div style={common.flexEnd}>
                            <button style={common.btnSecondary} onClick={() => navigate('/')}>목록으로</button>
                            <button style={common.btnPrimary} onClick={handleSubmit}>등록하기</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Notice