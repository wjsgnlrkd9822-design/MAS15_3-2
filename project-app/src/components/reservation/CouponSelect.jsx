import { useEffect, useState } from 'react'
import api from '../../api/api'

// 예약 페이지에서 쿠폰 선택 컴포넌트
// props:
//   userNo       - 현재 로그인 회원번호
//   totalPrice   - 예약 총 금액
//   onApply      - 쿠폰 적용 콜백 (discountAmount, couponNo) => void
const CouponSelect = ({ userNo, totalPrice, onApply }) => {
    const [coupons, setCoupons] = useState([])
    const [selectedCoupon, setSelectedCoupon] = useState(null)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (!userNo) return
        api.get(`/api/coupon/available/${userNo}`)
            .then(res => setCoupons(res.data))
            .catch(err => console.error(err))
    }, [userNo])

    const gradeLabel = { BRONZE: '🥉 브론즈', SILVER: '🥈 실버', GOLD: '🥇 골드', VIP: '💎 VIP', NEW: '🎉 신규' }
    const typeLabel  = { MONTHLY: '월정 쿠폰', NEW_USER: '신규가입 쿠폰' }

    const handleSelect = (coupon) => {
        setSelectedCoupon(coupon)
        onApply(coupon.discountAmount, coupon.couponNo)
        setIsOpen(false)
    }

    const handleCancel = () => {
        setSelectedCoupon(null)
        onApply(0, null)
    }

    return (
        <div style={styles.wrap}>
            <label style={styles.label}>🎟 쿠폰 선택</label>

            {selectedCoupon ? (
                <div style={styles.selected}>
                    <div>
                        <span style={{ ...styles.gradeBadge, ...gradeColor(selectedCoupon.grade) }}>
                            {gradeLabel[selectedCoupon.grade]}
                        </span>
                        <span style={styles.typeTxt}>{typeLabel[selectedCoupon.couponType]}</span>
                        <strong style={{ color: '#e53e3e' }}> -{selectedCoupon.discountAmount.toLocaleString()}원</strong>
                    </div>
                    <button style={styles.cancelBtn} onClick={handleCancel}>취소</button>
                </div>
            ) : (
                <button
                    style={styles.openBtn}
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={coupons.length === 0}
                >
                    {coupons.length === 0 ? '사용 가능한 쿠폰 없음' : `쿠폰 선택 (${coupons.length}장)`}
                </button>
            )}

            {isOpen && (
                <div style={styles.dropdown}>
                    {coupons.map(coupon => (
                        <div
                            key={coupon.couponNo}
                            style={styles.couponItem}
                            onClick={() => handleSelect(coupon)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ ...styles.gradeBadge, ...gradeColor(coupon.grade) }}>
                                    {gradeLabel[coupon.grade]}
                                </span>
                                <span style={styles.typeTxt}>{typeLabel[coupon.couponType]}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                                <span style={{ color: '#e53e3e', fontWeight: 700 }}>
                                    -{coupon.discountAmount.toLocaleString()}원 할인
                                </span>
                                <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                                    만료: {coupon.expiredAt?.substring(0, 10)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const gradeColor = (grade) => {
    const map = {
        VIP:    { backgroundColor: '#fef3c7', color: '#92400e' },
        GOLD:   { backgroundColor: '#fef3c7', color: '#b45309' },
        SILVER: { backgroundColor: '#f1f5f9', color: '#475569' },
        BRONZE: { backgroundColor: '#fdf4ec', color: '#92400e' },
        NEW:    { backgroundColor: '#ecfdf5', color: '#065f46' },
    }
    return map[grade] || {}
}

const styles = {
    wrap: { marginBottom: '16px' },
    label: { display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.95rem' },
    openBtn: {
        width: '100%', padding: '10px 14px', border: '1px dashed #d1d5db',
        borderRadius: '8px', background: '#fff', cursor: 'pointer',
        fontSize: '0.9rem', color: '#374151', textAlign: 'left',
    },
    selected: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 14px', border: '1px solid #3b82f6',
        borderRadius: '8px', background: '#eff6ff',
    },
    cancelBtn: {
        background: 'none', border: 'none', color: '#6b7280',
        cursor: 'pointer', fontSize: '0.85rem',
    },
    dropdown: {
        border: '1px solid #e5e7eb', borderRadius: '8px',
        background: '#fff', marginTop: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxHeight: '260px', overflowY: 'auto',
    },
    couponItem: {
        padding: '12px 16px', cursor: 'pointer',
        borderBottom: '1px solid #f3f4f6',
        transition: 'background 0.15s',
    },
    gradeBadge: {
        padding: '2px 8px', borderRadius: '20px',
        fontSize: '0.8rem', fontWeight: 600,
    },
    typeTxt: { fontSize: '0.9rem', color: '#374151' },
}

export default CouponSelect
