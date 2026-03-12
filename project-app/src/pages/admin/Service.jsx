import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import { common, formatNumber } from './adminStyles'
import Pagination from './Pagination'
import api from '../../api/api'

const Service = () => {
    const [roomPageInfo, setRoomPageInfo] = useState(null)
    const [servicePageInfo, setServicePageInfo] = useState(null)
    const [roomPage, setRoomPage] = useState(1)
    const [servicePage, setServicePage] = useState(1)

    useEffect(() => {
        api.get(`/admin/service?roomPage=${roomPage}&servicePage=${servicePage}&size=10`)
            .then(res => {
                setRoomPageInfo(res.data.roomPageInfo)
                setServicePageInfo(res.data.servicePageInfo)
            })
            .catch(err => console.error(err))
    }, [roomPage, servicePage])

    const roomList = roomPageInfo?.list || []
    const serviceList = servicePageInfo?.list || []

    return (
        <div style={common.page}>
            <Sidebar />
            <main style={common.main}>
                <header style={common.header}>시설 및 서비스 관리</header>
                <section style={common.section}>

                    {/* 시설 목록 */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h5 style={{ margin: 0 }}>시설 목록</h5>
                            <Link to="/admin/roominsert" style={common.btnPrimary}>시설 추가</Link>
                        </div>
                        <div style={common.card}>
                            <table style={common.table}>
                                <thead>
                                    <tr>
                                        <th style={common.th}>시설 이름</th>
                                        <th style={common.th}>상태</th>
                                        <th style={common.th}>가격</th>
                                        <th style={common.th}>관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roomList.length === 0 ? (
                                        <tr><td colSpan={4} style={{ ...common.td, textAlign: 'center', color: '#9ca3af' }}>등록된 시설이 없습니다.</td></tr>
                                    ) : roomList.map(room => (
                                        <tr key={room.roomNo}>
                                            <td style={common.td}>{room.roomType}</td>
                                            <td style={common.td}>
                                                <span style={styles.badgeGreen}>사용 가능</span>
                                            </td>
                                            <td style={common.td}>{formatNumber(room.roomPrice)}원</td>
                                            <td style={common.td}>
                                                <Link to={`/admin/roomup?roomNo=${room.roomNo}`} style={common.btnOutline}>수정</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* 시설 페이징 */}
                        <Pagination pageInfo={roomPageInfo} onPageChange={setRoomPage} />
                    </div>

                    {/* 서비스 목록 */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h5 style={{ margin: 0 }}>서비스 목록</h5>
                            <Link to="/admin/serviceinsert" style={common.btnPrimary}>서비스 추가</Link>
                        </div>
                        <div style={common.card}>
                            <table style={common.table}>
                                <thead>
                                    <tr>
                                        <th style={common.th}>서비스 이름</th>
                                        <th style={common.th}>가격</th>
                                        <th style={common.th}>관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviceList.length === 0 ? (
                                        <tr><td colSpan={3} style={{ ...common.td, textAlign: 'center', color: '#9ca3af' }}>등록된 서비스가 없습니다.</td></tr>
                                    ) : serviceList.map(service => (
                                        <tr key={service.serviceNo}>
                                            <td style={common.td}>{service.serviceName}</td>
                                            <td style={common.td}>{formatNumber(service.servicePrice)}원</td>
                                            <td style={common.td}>
                                                <Link to={`/admin/serviceupdate?serviceNo=${service.serviceNo}`} style={common.btnOutline}>수정</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* 서비스 페이징 */}
                        <Pagination pageInfo={servicePageInfo} onPageChange={setServicePage} />
                    </div>

                </section>
            </main>
        </div>
    )
}

const styles = {
    badgeGreen: {
        backgroundColor: '#d1fae5', color: '#065f46',
        padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem',
    },
}

export default Service