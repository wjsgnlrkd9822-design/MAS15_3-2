import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import { common } from './adminStyles'
import api from '../../api/api'

const RoomUpdate = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const roomNo = searchParams.get('roomNo')
    const [form, setForm] = useState({ roomType: '', roomPrice: '', etc: '', img: '' })
    const [imgFile, setImgFile] = useState(null)

    useEffect(() => {
        api.get(`/admin/roomup?roomNo=${roomNo}`)
            .then(res => setForm(res.data))
            .catch(err => console.error(err))
    }, [roomNo])

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
            await api.post(`/admin/update/${roomNo}`, {
                roomType: form.roomType,
                roomPrice: parseInt(form.roomPrice),
                etc: form.etc,
                img: imgFileName
            })
            alert('객실 정보가 수정되었습니다.')
            navigate('/admin/service')
        } catch {
            alert('예약된 방이 있거나 오류가 있습니다.')
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('정말로 삭제하시겠습니까?')) return
        try {
            await api.delete(`/admin/room/delete/${roomNo}`)
            alert('객실이 삭제되었습니다.')
            navigate('/admin/service')
        } catch {
            alert('예약된 내역이 있어 삭제할 수 없습니다.')
        }
    }

    return (
        <div style={common.page}>
            <Sidebar />
            <main style={common.main}>
                <header style={common.header}>객실 수정</header>
                <section style={common.section}>
                    <div style={common.card}>
                        <div style={common.formGroup}>
                            <label style={common.label}>객실명</label>
                            <input style={common.input} name="roomType" value={form.roomType} onChange={handleChange} />
                        </div>
                        <div style={common.formGroup}>
                            <label style={common.label}>가격</label>
                            <input style={common.input} name="roomPrice" type="number" value={form.roomPrice} onChange={handleChange} />
                        </div>
                        <div style={common.formGroup}>
                            <label style={common.label}>세부 사항</label>
                            <textarea style={{ ...common.input, height: '100px', resize: 'vertical' }} name="etc" value={form.etc} onChange={handleChange} />
                        </div>
                        <div style={common.formGroup}>
                            <label style={common.label}>객실 이미지</label>
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
                            <button style={common.btnSecondary} onClick={() => navigate('/admin/service')}>목록</button>
                            <button style={common.btnPrimary} onClick={handleSubmit}>저장</button>
                            <button style={common.btnDanger} onClick={handleDelete}>삭제</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default RoomUpdate