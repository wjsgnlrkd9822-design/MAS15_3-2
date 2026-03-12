import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import { common } from './adminStyles'
import api from '../../api/api'

const TrainerUpdate = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const trainerNo = searchParams.get('trainerNo')
    const [form, setForm] = useState({ trainerName: '', gender: '', detail: '', img: '' })
    const [imgFile, setImgFile] = useState(null)

    useEffect(() => {
        api.get(`/admin/trainerupdate?trainerNo=${trainerNo}`)
            .then(res => setForm(res.data))
            .catch(err => console.error(err))
    }, [trainerNo])

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async () => {
        try {
            let imgFileName = form.img
            if (imgFile) {
                const formData = new FormData()
                formData.append('imgFile', imgFile)
                const res = await api.post('/admin/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                imgFileName = res.data
            }
            await api.put(`/admin/trainerupdate/${trainerNo}`, {
                trainerName: form.trainerName,
                gender: form.gender,
                detail: form.detail,
                img: imgFileName
            })
            alert('수정되었습니다.')
            navigate('/admin/trainer')
        } catch {
            alert('수정 실패')
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('정말로 삭제하시겠습니까?')) return
        try {
            await api.delete(`/admin/trainer/delete/${trainerNo}`)
            alert('훈련사가 삭제되었습니다.')
            navigate('/admin/trainer')
        } catch {
            alert('삭제 실패')
        }
    }

    return (
        <div style={common.page}>
            <Sidebar />
            <main style={common.main}>
                <header style={common.header}>훈련사 수정</header>
                <section style={common.section}>
                    <div style={common.card}>
                        <div style={common.formGroup}>
                            <label style={common.label}>훈련사 이름</label>
                            <input style={common.input} name="trainerName" value={form.trainerName} onChange={handleChange} />
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
                            <textarea style={{ ...common.input, height: '100px', resize: 'vertical' }} name="detail" value={form.detail} onChange={handleChange} />
                        </div>
                        <div style={common.formGroup}>
                            <label style={common.label}>트레이너 이미지</label>
                            <input style={common.input} type="file" accept="image/*" onChange={e => setImgFile(e.target.files[0])} />
                            {form.img && (
                                <div style={{ marginTop: '8px' }}>
                                    <small style={{ color: '#6b7280' }}>기존 이미지:</small><br />
                                    <img src={`http://localhost:8080/uploads/${form.img}`} alt="기존 이미지"
                                        style={{ width: '200px', border: '1px solid #ddd', borderRadius: '4px', marginTop: '4px' }} />
                                </div>
                            )}
                        </div>
                        <div style={common.flexEnd}>
                            <button style={common.btnDanger} onClick={handleDelete}>삭제하기</button>
                            <button style={common.btnPrimary} onClick={handleSubmit}>수정하기</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default TrainerUpdate