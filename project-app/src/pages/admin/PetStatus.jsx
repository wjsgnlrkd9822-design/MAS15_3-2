import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { common } from './adminStyles'
import Pagination from './Pagination'
import api from '../../api/api'

const statusMap = {
    RESTING: { label: '🛏 휴식중',      bg: '#e3f2fd', color: '#1976d2' },
    PLAYING: { label: '⚽ 놀이중',      bg: '#fff3e0', color: '#f57c00' },
    EATING:  { label: '🍽 식사중',      bg: '#ffebee', color: '#d32f2f' },
    WALKING: { label: '🚶 산책중',      bg: '#e8f5e9', color: '#388e3c' },
    BRAIN:   { label: '🎓 교육 진행중', bg: '#f3e5f5', color: '#7b1fa2' },
}

const PetStatus = () => {
    const [pageInfo, setPageInfo] = useState(null)
    const [page, setPage] = useState(1)
    const [modal, setModal] = useState(null)

    const fetchData = (p) => {
        api.get(`/admin/petstatus?page=${p}&size=10`)
            .then(res => setPageInfo(res.data))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        fetchData(page)
    }, [page])

    const petList = pageInfo?.list || []

    const openModal = (pet) => {
        setModal({
            petNo: pet.petNo,
            petName: pet.petName,
            status: pet.petStatus || '',
            nextSchedule: pet.nextSchedule || ''
        })
    }

    const handleSave = async () => {
        if (!modal.status) { alert('현재 상태를 선택해주세요.'); return }
        try {
            await api.put(`/admin/petstatus/update/${modal.petNo}`, {
                status: modal.status,
                nextSchedule: modal.nextSchedule || null
            })
            alert('상태가 저장되었습니다.')
            setModal(null)
            fetchData(page)
        } catch {
            alert('저장 실패')
        }
    }

    return (
        <div style={common.page}>
            <Sidebar />
            <main style={common.main}>
                <header style={common.header}>🐾 반려견 상태 관리</header>
                <section style={common.section}>

                    <p style={{ color: '#6b7280', marginBottom: '16px' }}>현재 체크인 중인 반려견의 상태를 관리하세요</p>

                    <div style={styles.statCard}>
                        <div>
                            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.85rem' }}>총 체크인</p>
                            <h3 style={{ margin: 0 }}>{pageInfo?.total || 0}</h3>
                        </div>
                        <span style={{ fontSize: '2.5rem', opacity: 0.2 }}>🐶</span>
                    </div>

                    <div style={common.card}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={common.table}>
                                <thead>
                                    <tr>
                                        {['반려견명','견종/크기','보호자','객실','체크인~체크아웃','현재 상태','다음 일정','관리'].map(h => (
                                            <th key={h} style={common.th}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {petList.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} style={{ ...common.td, textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
                                                현재 체크인 중인 반려견이 없습니다.
                                            </td>
                                        </tr>
                                    ) : petList.map((pet, idx) => {
                                        const statusInfo = statusMap[pet.petStatus]
                                        return (
                                            <tr key={idx}>
                                                <td style={common.td}><strong>{pet.petName}</strong></td>
                                                <td style={common.td}>
                                                    {pet.petSpecies}<br />
                                                    <small style={{ color: '#9ca3af' }}>{pet.petSize}</small>
                                                </td>
                                                <td style={common.td}>
                                                    {pet.ownerName}<br />
                                                    <small style={{ color: '#9ca3af' }}>{pet.ownerPhone}</small>
                                                </td>
                                                <td style={common.td}>{pet.roomType}</td>
                                                <td style={common.td}>
                                                    <small>✅ {pet.checkin}<br />❌ {pet.checkout}</small>
                                                </td>
                                                <td style={common.td}>
                                                    {statusInfo ? (
                                                        <span style={{ ...styles.badge, backgroundColor: statusInfo.bg, color: statusInfo.color }}>
                                                            {statusInfo.label}
                                                        </span>
                                                    ) : (
                                                        <span style={{ ...styles.badge, backgroundColor: '#f5f5f5', color: '#757575' }}>미설정</span>
                                                    )}
                                                </td>
                                                <td style={common.td}>{pet.nextSchedule || '-'}</td>
                                                <td style={common.td}>
                                                    <button style={common.btnPrimary} onClick={() => openModal(pet)}>✏</button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Pagination pageInfo={pageInfo} onPageChange={setPage} />

                </section>
            </main>

            {modal && (
                <div style={styles.overlay}>
                    <div style={styles.modalBox}>
                        <div style={styles.modalHeader}>
                            <h5 style={{ margin: 0, color: '#fff' }}>✏ 반려견 상태 수정</h5>
                            <button style={styles.closeBtn} onClick={() => setModal(null)}>✕</button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={common.formGroup}>
                                <label style={common.label}>반려견 이름</label>
                                <input style={common.input} value={modal.petName} readOnly />
                            </div>
                            <div style={common.formGroup}>
                                <label style={common.label}>현재 상태</label>
                                <select style={common.input} value={modal.status} onChange={e => setModal({ ...modal, status: e.target.value })}>
                                    <option value="">선택하세요</option>
                                    <option value="RESTING">휴식중</option>
                                    <option value="PLAYING">놀이중</option>
                                    <option value="EATING">식사중</option>
                                    <option value="WALKING">산책중</option>
                                    <option value="BRAIN">교육 프로그램 진행중</option>
                                </select>
                            </div>
                            <div style={common.formGroup}>
                                <label style={common.label}>다음 일정</label>
                                <input style={common.input} placeholder="예: 16:00 산책"
                                    value={modal.nextSchedule}
                                    onChange={e => setModal({ ...modal, nextSchedule: e.target.value })} />
                            </div>
                            <div style={common.flexEnd}>
                                <button style={common.btnSecondary} onClick={() => setModal(null)}>취소</button>
                                <button style={common.btnPrimary} onClick={handleSave}>저장</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const styles = {
    statCard: {
        backgroundColor: '#fff', borderRadius: '8px', padding: '16px 20px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)', marginBottom: '20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: '200px',
    },
    badge: {
        display: 'inline-block', padding: '4px 10px',
        borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600,
    },
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    modalBox: {
        backgroundColor: '#fff', borderRadius: '10px',
        width: '460px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    },
    modalHeader: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '16px 20px', borderRadius: '10px 10px 0 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    closeBtn: {
        background: 'none', border: 'none', color: '#fff',
        fontSize: '1.1rem', cursor: 'pointer',
    },
}

export default PetStatus