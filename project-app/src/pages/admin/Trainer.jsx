import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import { common } from './adminStyles'
import Pagination from './Pagination'
import api from '../../api/api'

const Trainer = () => {
    const [pageInfo, setPageInfo] = useState(null)
    const [page, setPage] = useState(1)

    useEffect(() => {
        api.get(`/admin/trainer?page=${page}&size=10`)
            .then(res => setPageInfo(res.data))
            .catch(err => console.error(err))
    }, [page])

    const trainerList = pageInfo?.list || []

    return (
        <div style={common.page}>
            <Sidebar />
            <main style={common.main}>
                <header style={common.header}>훈련사 목록</header>
                <section style={common.section}>

                    <div style={{ textAlign: 'right', marginBottom: '12px' }}>
                        <Link to="/admin/trainerinsert" style={common.btnPrimary}>훈련사 추가</Link>
                    </div>

                    <div style={common.card}>
                        <table style={common.table}>
                            <thead>
                                <tr>
                                    <th style={common.th}>훈련사 이름</th>
                                    <th style={common.th}>성별</th>
                                    <th style={common.th}>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainerList.length === 0 ? (
                                    <tr><td colSpan={3} style={{ ...common.td, textAlign: 'center', color: '#9ca3af' }}>등록된 훈련사가 없습니다.</td></tr>
                                ) : trainerList.map(trainer => (
                                    <tr key={trainer.trainerNo}>
                                        <td style={common.td}>{trainer.trainerName}</td>
                                        <td style={common.td}>{trainer.gender}</td>
                                        <td style={common.td}>
                                            <Link to={`/admin/trainerupdate?trainerNo=${trainer.trainerNo}`} style={common.btnOutline}>수정</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination pageInfo={pageInfo} onPageChange={setPage} />

                </section>
            </main>
        </div>
    )
}

export default Trainer