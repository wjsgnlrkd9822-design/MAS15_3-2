import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { common } from './adminStyles'
import api from '../../api/api'

const ServiceInsert = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({ serviceName: '', servicePrice: '', description: '' })

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async () => {
        try {
            await api.post('/admin/serviceadd', {
                serviceName: form.serviceName,
                servicePrice: parseInt(form.servicePrice),
                description: form.description
            })
            alert('서비스가 추가되었습니다.')
            navigate('/admin/service')
        } catch {
            alert('서비스 추가에 실패했습니다.')
        }
    }

    return (
        <div style={common.page}>
            <Sidebar />
            <main style={common.main}>
                <header style={common.header}>서비스 추가</header>
                <section style={common.section}>
                    <div style={common.card}>
                        <div style={common.formGroup}>
                            <label style={common.label}>서비스 이름</label>
                            <input style={common.input} name="serviceName" placeholder="예: 애견 미용" value={form.serviceName} onChange={handleChange} />
                        </div>
                        <div style={common.formGroup}>
                            <label style={common.label}>가격</label>
                            <input style={common.input} name="servicePrice" type="number" placeholder="예: 30000" value={form.servicePrice} onChange={handleChange} />
                        </div>
                        <div style={common.formGroup}>
                            <label style={common.label}>서비스 설명</label>
                            <textarea style={{ ...common.input, height: '100px', resize: 'vertical' }} name="description" placeholder="서비스 특징, 주의사항" value={form.description} onChange={handleChange} />
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

export default ServiceInsert