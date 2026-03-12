import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { common } from './adminStyles'
import Pagination from './Pagination'  // ✅ 1. import 추가
import api from '../../api/api'

const UserManage = () => {
    const [pageInfo, setPageInfo] = useState(null)  // ✅ 2. state 변경
    const [page, setPage] = useState(1)             // ✅ 2. page state 추가

    useEffect(() => {
        api.get(`/admin/usermanage?page=${page}&size=10`)  // ✅ 3. URL에 page 파라미터 추가
            .then(res => setPageInfo(res.data))
            .catch(err => console.error(err))
    }, [page])  // ✅ page 바뀔 때마다 재호출

    const userList = pageInfo?.list || []  // ✅ pageInfo에서 list 추출

    const handleDelete = async (userId) => {
        if (!window.confirm('회원을 삭제하시겠습니까?')) return
        try {
            await api.delete(`/admin/user/delete/${userId}`)
            alert('회원이 삭제되었습니다.')
            // ✅ 삭제 후 현재 페이지 재조회
            api.get(`/admin/usermanage?page=${page}&size=10`)
                .then(res => setPageInfo(res.data))
        } catch {
            alert('회원 삭제에 실패했습니다.')
        }
    }

    return (
        <div style={common.page}>
            <Sidebar />
            <main style={common.main}>
                <header style={common.header}>회원 관리</header>
                <section style={common.section}>

                    <div style={{ ...common.card, padding: '12px 20px', marginBottom: '8px' }}>
                        <div style={styles.headerRow}>
                            <div style={styles.col}>이름</div>
                            <div style={styles.col}>이메일</div>
                            <div style={styles.col}>전화번호</div>
                            <div style={styles.col}>등록일자</div>
                            <div style={styles.col}>관리</div>
                        </div>
                    </div>

                    <div style={common.card}>
                        {userList.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>
                                등록된 회원이 없습니다.
                            </div>
                        ) : (
                            userList.map((user, idx) => (
                                <div key={user.no || idx} style={{
                                    ...styles.row,
                                    borderBottom: idx < userList.length - 1 ? '1px solid #f0f0f0' : 'none'
                                }}>
                                    <div style={styles.col}>{user.name}</div>
                                    <div style={styles.col}>{user.email}</div>
                                    <div style={styles.col}>{user.phone}</div>
                                    <div style={styles.col}>
                                        {user.createdAt ? new Date(user.createdAt).toLocaleString('ko-KR') : '-'}
                                    </div>
                                    <div style={styles.col}>
                                        <button style={common.btnDanger} onClick={() => handleDelete(user.no)}>
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* ✅ 4. 페이징 컴포넌트 추가 */}
                    <Pagination pageInfo={pageInfo} onPageChange={setPage} />

                </section>
            </main>
        </div>
    )
}

const styles = {
    headerRow: { display: 'flex', textAlign: 'center', fontWeight: 600, color: '#6b7280' },
    row: { display: 'flex', alignItems: 'center', textAlign: 'center', padding: '10px 0' },
    col: { flex: 1, fontSize: '0.9rem' },
}

export default UserManage