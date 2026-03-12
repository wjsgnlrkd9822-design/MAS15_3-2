export const common = {
    page: { display: 'flex' },
    main: { flex: 1, backgroundColor: '#f5f6f7', minHeight: '100vh' },
    header: {
        backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb',
        padding: '12px 24px', fontWeight: 600, fontSize: '1.1rem',
    },
    section: { padding: '24px' },
    card: {
        backgroundColor: '#fff', borderRadius: '8px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)', padding: '20px', marginBottom: '20px',
    },
    cardTitle: { fontWeight: 600, marginBottom: '12px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
    th: {
        padding: '10px 14px', textAlign: 'center',
        border: '1px solid #e5e7eb', fontWeight: 600,
        backgroundColor: '#f9fafb', color: '#374151',
    },
    td: { padding: '10px 14px', border: '1px solid #e5e7eb', color: '#374151' },
    btnPrimary: {
        backgroundColor: '#0d6efd', color: '#fff', border: 'none',
        padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
    },
    btnSecondary: {
        backgroundColor: '#6c757d', color: '#fff', border: 'none',
        padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
        textDecoration: 'none', display: 'inline-block',
    },
    btnDanger: {
        backgroundColor: '#dc3545', color: '#fff', border: 'none',
        padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
    },
    btnOutline: {
        backgroundColor: 'transparent', color: '#0d6efd',
        border: '1px solid #0d6efd', padding: '4px 10px',
        borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', textDecoration: 'none',
    },
    input: {
        width: '100%', padding: '8px 12px', border: '1px solid #dee2e6',
        borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box',
    },
    label: { display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' },
    formGroup: { marginBottom: '16px' },
    flexEnd: { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' },
}

export const formatNumber = (num) => {
    if (!num) return '0'
    return Number(num).toLocaleString('ko-KR')
}