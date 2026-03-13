const Pagination = ({ pageInfo, onPageChange }) => {
    if (!pageInfo || pageInfo.pages <= 1) return null

    const { pageNum, pages, navigatepageNums } = pageInfo

    return (
        <div style={styles.wrap}>
            <button
                style={{ ...styles.btn, ...(pageNum <= 1 ? styles.disabled : {}) }}
                onClick={() => onPageChange(pageNum - 1)}
                disabled={pageNum <= 1}
            >
                &lt;
            </button>

            {navigatepageNums?.map(num => (
                <button
                    key={num}
                    style={{ ...styles.btn, ...(num === pageNum ? styles.active : {}) }}
                    onClick={() => onPageChange(num)}
                >
                    {num}
                </button>
            ))}

            <button
                style={{ ...styles.btn, ...(pageNum >= pages ? styles.disabled : {}) }}
                onClick={() => onPageChange(pageNum + 1)}
                disabled={pageNum >= pages}
            >
                &gt;
            </button>
        </div>
    )
}

const styles = {
    wrap: { display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '20px' },
    btn: {
        padding: '6px 12px', border: '1px solid #dee2e6',
        borderRadius: '4px', cursor: 'pointer',
        backgroundColor: '#fff', fontSize: '0.9rem',
    },
    active: { backgroundColor: '#0d6efd', color: '#fff', border: '1px solid #0d6efd' },
    disabled: { color: '#9ca3af', cursor: 'not-allowed' },
}

export default Pagination