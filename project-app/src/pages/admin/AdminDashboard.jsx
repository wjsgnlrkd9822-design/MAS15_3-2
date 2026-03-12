import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import { common, formatNumber } from './adminStyles'
import api  from '../../api/api'

const AdminDashboard = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/admin')
            .then(res => {
                setData(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    return (
        <div style={common.page}>
            <Sidebar />
            <main style={common.main}>
                <header style={common.header}>매출 조회</header>
                <section style={common.section}>

                    <p style={{ color: '#6b7280', marginBottom: '20px' }}>전체 매출 내역을 확인하세요</p>

                    {loading ? (
                        <p>로딩 중...</p>
                    ) : (
                        <>
                            {/* 총 매출 카드 */}
                            <div style={styles.salesCard}>
                                <div style={{ color: '#6b7280' }}>총 매출</div>
                                <div style={styles.salesAmount}>{formatNumber(data?.totalSales)}원</div>
                                <div style={{ fontSize: '2rem', color: '#0d6efd' }}>$</div>
                            </div>

                            {/* 회원별 매출 */}
                            <div style={common.card}>
                                <h6 style={common.cardTitle}>회원별 총 매출</h6>
                                <table style={common.table}>
                                    <thead>
                                        <tr>
                                            <th style={common.th}>회원번호</th>
                                            <th style={common.th}>회원이름</th>
                                            <th style={common.th}>총 매출</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.memberSales?.length > 0 ? (
                                            data.memberSales.map((sale, idx) => (
                                                <tr key={idx}>
                                                    <td style={common.td}>{sale.userNo}</td>
                                                    <td style={common.td}>{sale.name}</td>
                                                    <td style={{ ...common.td, textAlign: 'right', fontWeight: 600 }}>
                                                        {formatNumber(sale.totalSales)}원
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} style={{ ...common.td, textAlign: 'center', color: '#9ca3af' }}>
                                                    데이터가 없습니다
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* 월별 매출 */}
                            <div style={common.card}>
                                <h6 style={common.cardTitle}>월별 총 매출</h6>
                                <table style={common.table}>
                                    <thead>
                                        <tr>
                                            <th style={common.th}>연도</th>
                                            <th style={common.th}>월</th>
                                            <th style={common.th}>총 매출</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.monthlySales?.length > 0 ? (
                                            data.monthlySales.map((sale, idx) => (
                                                <tr key={idx}>
                                                    <td style={common.td}>{sale.year}</td>
                                                    <td style={common.td}>{sale.month}</td>
                                                    <td style={{ ...common.td, textAlign: 'right', fontWeight: 600 }}>
                                                        {formatNumber(sale.totalSales)}원
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} style={{ ...common.td, textAlign: 'center', color: '#9ca3af' }}>
                                                    데이터가 없습니다
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </section>
            </main>
        </div>
    )
}

const styles = {
    salesCard: {
        backgroundColor: '#fff',
        borderLeft: '5px solid #0d6efd',
        borderRadius: '8px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    salesAmount: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
    },
}

export default AdminDashboard