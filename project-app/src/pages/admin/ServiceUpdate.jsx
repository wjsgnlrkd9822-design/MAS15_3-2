import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import { common } from './adminStyles'
import api from '../../api/api'

const ServiceUpdate = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const serviceNo = searchParams.get('serviceNo')
    const [form, setForm] = useState({ serviceName: '', servicePrice: '', description: '' })

    useEffect(() => {
        api.get(`/admin/serviceupdate?serviceNo=${serviceNo}`)
            .then(res => setForm(res.data))
            .catch(err => console.error(err))
    }, [serviceNo])

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async () => {
        try {
            await api.put(`/admin/update/${serviceNo}`, {
                serviceName: form.serviceName,
                servicePrice: parseInt(form.servicePrice),
                description: form.description
            })
            alert('서비스가 수정되었습니다.')
            navigate('/admin/service')
        } catch {
            alert('서비스 수정에 실패했습니다.')
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('정말로 삭제하시겠습니까?')) return
        try {
            await api.delete(`/admin/service/delete/${serviceNo}`)
            alert('서비스가 삭제되었습니다.')
            navigate('/admin/service')
        } catch {
            alert('서비스 삭제에 실패했습니다.')
        }
    }

    return (
        <div style={common.page}>
            <Sidebar />
            <main style={common.main}>
                <header style={common.header}>서비스 수정</header>
                <section style={common.section}>
                    <div style={common.card}>
                        <div style={common.formGroup}>
                            <label style={common.label}>서비스 이름</label>
                            <input style={common.input} name="serviceName" value={form.serviceName} onChange={handleChange} />
                        </div>
                        <div style={common.formGroup}>
                            <label style={common.label}>가격</label>
                            <input style={common.input} name="servicePrice" type="number" value={form.servicePrice} onChange={handleChange} />
                        </div>
                        <div style={common.formGroup}>
                            <label style={common.label}>서비스 설명</label>
                            <textarea style={{ ...common.input, height: '100px', resize: 'vertical' }} name="description" value={form.description} onChange={handleChange} />
                        </div>
                        <div style={common.flexEnd}>
                            <button style={common.btnSecondary} onClick={() => navigate('/admin/service')}>목록으로</button>
                            <button style={common.btnPrimary} onClick={handleSubmit}>저장</button>
                            <button style={common.btnDanger} onClick={handleDelete}>삭제</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default ServiceUpdate