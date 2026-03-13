import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { common } from './adminStyles'
import api from '../../api/api'

const RoomInsert = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({ roomType: '', roomPrice: '', etc: '' })
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
            await api.post('/admin/add', {
                roomType: form.roomType,
                roomPrice: parseInt(form.roomPrice),
                etc: form.etc,
                img: imgFileName
            })
            alert('객실이 등록되었습니다.')
            navigate('/admin/service')
        } catch {
            alert('등록 실패')
        }
    }

    return (
        <div style={common.page}>
            <Sidebar />
            <main style={common.main}>
                <header style={common.header}>객실 추가</header>
                <section style={common.section}>
                    <div style={common.card}>
                        <div style={common.formGroup}>
                            <label style={common.label}>객실명</label>
                            <input style={common.input} name="roomType" placeholder="객실명을 입력해주세요" value={form.roomType} onChange={handleChange} />
                        </div>
                        <div style={common.formGroup}>
                            <label style={common.label}>가격</label>
                            <input style={common.input} name="roomPrice" type="number" placeholder="가격을 입력해주세요" value={form.roomPrice} onChange={handleChange} />
                        </div>
                        <div style={common.formGroup}>
                            <label style={common.label}>객실 타입</label>
                            <textarea style={{ ...common.input, height: '100px', resize: 'vertical' }} name="etc" placeholder="소형견, 중형견, 대형견 타입 중 하나를 입력해주세요" value={form.etc} onChange={handleChange} />
                        </div>
                        <div style={common.formGroup}>
                            <label style={common.label}>객실 이미지</label>
                            <input style={common.input} type="file" accept="image/*" onChange={e => setImgFile(e.target.files[0])} />
                        </div>
                        <div style={common.flexEnd}>
                            <button style={common.btnSecondary} onClick={() => navigate('/admin/service')}>목록으로</button>
                            <button style={common.btnPrimary} onClick={handleSubmit}>등록하기</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default RoomInsert