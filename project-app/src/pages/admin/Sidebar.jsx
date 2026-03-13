import { Link, useLocation } from 'react-router-dom'

const menuItems = [
    { path: '/admin',            label: '📊 매출 조회' },
    { path: '/admin/usermanage', label: '👥 회원 관리' },
    { path: '/admin/service',    label: '⚙️ 서비스 및 시설 관리' },
    { path: '/admin/trainer',    label: '🏇 훈련사 관리' },
    { path: '/admin/notice',     label: '📝 공지사항' },
    { path: '/admin/petstatus',  label: '🐾 반려견 상태 관리' },
]

const Sidebar = () => {
    const location = useLocation()

    return (
        <aside style={s.sidebar}>
            <h5 style={s.title}>관리자 페이지</h5>
            <nav style={s.nav}>
                {menuItems.map(item => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{ ...s.link, ...(isActive ? s.active : {}) }}
                        >
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}

const s = {
    sidebar: {
        width: '240px', minHeight: '100vh', backgroundColor: '#1f2933',
        color: '#fff', padding: '24px 16px', flexShrink: 0,
    },
    title: { fontWeight: 600, marginBottom: '24px', fontSize: '1rem' },
    nav: { display: 'flex', flexDirection: 'column', gap: '4px' },
    link: {
        color: '#cbd5e1', padding: '10px 14px', borderRadius: '6px',
        textDecoration: 'none', fontSize: '0.9rem', display: 'block',
    },
    active: { backgroundColor: '#374151', color: '#fff' },
}

export default Sidebar