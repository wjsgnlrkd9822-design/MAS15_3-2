import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { common } from './adminStyles'
import api from '../../api/api'

const TrainerInsert = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({ trainerName: '', gender: '', description: '' })
    const [imgFile, setImgFile] = useState(null)

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async () => {
        try {
            let imgFileName = null
            if (imgFile) {
                const formData = new FormData()
                formData.append('imgFile', imgFile)
                const res = await api.post('/admin/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                imgFileName = res.data
            }
            await api.post('/admin/traineradd', {
                trainerName: form.trainerName,
                gender: form.gender,
                detail: form.description,
                img: imgFileName
            })
            alert('훈련사가 추가되었습니다.')
            navigate('/admin/trainer')
        } catch {
            alert('등록 실패')
        }
    }

    return (
        <div style={common.page}>
            <Sidebar />
            <main style={common.main}>
                <header style={common.header}>훈련사 추가</header>
                <section style={common.section}>
                    <div style={common.card}>
                        <div style={common.formGroup}>
                            <label style={common.label}>훈련사 이름</label>
                            <input style={common.input} name="trainerName" placeholder="훈련사 이름 입력" value={form.trainerName} onChange={handleChange} />
                        </div>
                        <div style={common.formGroup}>
                            <label style={common.label}>성별</label>
                            <select style={common.input} name="gender" value={form.gender} onChange={handleChange}>
                                <option value="">선택</option>
                                <option value="남">남</option>
                                <option value="여">여</option>
                            </select>
                        </div>
                        <div style={common.formGroup}>
                            <label style={common.label}>세부사항</label>
                            <textarea style={{ ...common.input, height: '100px', resize: 'vertical' }} name="description" placeholder="훈련사 경력, 전문 분야 등" value={form.description} onChange={handleChange} />
                        </div>
                        <div style={common.formGroup}>
                            <label style={common.label}>트레이너 이미지</label>
                            <input style={common.input} type="file" accept="image/*" onChange={e => setImgFile(e.target.files[0])} />
                        </div>
                        <div style={common.flexEnd}>
                            <button style={common.btnSecondary} onClick={() => navigate('/admin/trainer')}>목록으로</button>
                            <button style={common.btnPrimary} onClick={handleSubmit}>등록하기</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default TrainerInsert