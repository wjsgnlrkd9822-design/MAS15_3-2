import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { getRoomDetail } from '../../apis/roomApi';
import { insertReservation } from '../../apis/reservationApi';
import { useRoomSchedule } from '../../hooks/useRoomSchedule';
import { formatDate, formatLocalDate, calcNights } from '../../utils/dateUtils';
import CouponSelect from './CouponSelect';
import '../../assets/reservation-detail.css'

// JWT 토큰에서 userNo 파싱
function getUserNoFromToken() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    const base64 = token.replace('Bearer ', '').split('.')[1]
    const payload = JSON.parse(atob(base64))
    return payload.uno ? Number(payload.uno) : null
  } catch (e) {
    return null
  }
}

export default function ReservationDetailPage() {
  const { roomNo } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [serviceList, setServiceList] = useState([]);
  const [pets, setPets] = useState([]);

  const [checkin, setCheckin]   = useState(searchParams.get('checkin') ? new Date(searchParams.get('checkin')) : null);
  const [checkout, setCheckout] = useState(searchParams.get('checkout') ? new Date(searchParams.get('checkout')) : null);
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [petNo, setPetNo] = useState('');

  // 쿠폰 상태
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedCouponNo, setSelectedCouponNo] = useState(null);

  // 토큰에서 userNo 추출
  const userNo = getUserNoFromToken();

  const { checkinUnavailable, checkoutUnavailable, validateDates, findNextReservationStart } = useRoomSchedule(roomNo);

  useEffect(() => {
    getRoomDetail(roomNo).then((data) => {
      if (data.success) {
        setRoom(data.room);
        setServiceList(data.roomServiceList);
        setPets(data.pets);
      }
    }).catch(console.error);
  }, [roomNo]);

  // 쿠폰 적용 콜백
  const handleCouponApply = (discount, couponNo) => {
    setDiscountAmount(discount);
    setSelectedCouponNo(couponNo);
  };

  // ─── 계산 ───
  const nights = calcNights(checkin, checkout);
  const roomTotal = nights * (room?.roomPrice || 0);
  const serviceTotal = [...selectedServices].reduce((sum, no) => {
    const s = serviceList.find((s) => s.serviceNo === no);
    return sum + (s?.servicePrice || 0);
  }, 0);
  const totalBeforeDiscount = roomTotal + serviceTotal;
  const total = Math.max(0, totalBeforeDiscount - discountAmount);

  const isCheckinUnavailable  = (date) => checkinUnavailable.includes(formatLocalDate(date));
  const isCheckoutUnavailable = (date) => checkoutUnavailable.includes(formatLocalDate(date));

  const handleCheckinChange = (date) => {
    setCheckin(date);
    if (checkout && checkout <= date) setCheckout(null);
  };

  const toggleService = (serviceNo) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      next.has(serviceNo) ? next.delete(serviceNo) : next.add(serviceNo);
      return next;
    });
  };

  const serviceIconMap = {
    '그루밍 서비스': 'fa-scissors',
    '프리미엄 식사': 'fa-utensils',
    '훈련 프로그램': 'fa-dog',
    '사진 촬영':    'fa-camera',
  };

  const handleReserve = async () => {
    if (!checkin || !checkout) { alert('체크인/체크아웃 날짜를 선택해주세요.'); return; }
    if (checkout <= checkin)   { alert('체크아웃 날짜는 체크인 날짜보다 이후여야 합니다.'); return; }
    if (!validateDates(checkin, checkout)) { alert('선택하신 날짜에 이미 예약이 있습니다. 다른 날짜를 선택해주세요.'); return; }
    if (!petNo) { alert('반려견을 선택해주세요.'); return; }
    if (!window.confirm('정말 예약하시겠습니까?')) return;

    try {
      await insertReservation(roomNo, {
        checkin:    formatLocalDate(checkin),
        checkout:   formatLocalDate(checkout),
        nights,
        total,
        totalPrice: total,
        serviceIds: [...selectedServices].join(','),
        petNo,
        couponNo:   selectedCouponNo,
        discount:   discountAmount,
      });
      alert('예약이 완료되었습니다!');
      navigate('/');
    } catch (e) {
      alert('예약 중 오류가 발생했습니다.');
      console.error(e);
    }
  };

  if (!room) return <div style={{ padding: 40, textAlign: 'center' }}>로딩 중...</div>;

  const nextResStart = findNextReservationStart(checkin);
  const checkoutMaxDate = nextResStart ? new Date(nextResStart.getTime() - 86400000) : undefined;

  return (
    <>
      <p className="reservation-text">Reservation</p>

      <div className="reservation-wrapper">
        <div className="reservation-detail-container">

          {/* ─── 달력 영역 ─── */}
          <div className="reservation-calendar">
            <div className="calendar-title">
              <div className="calendar-title-row">
                <i className="fa-solid fa-calendar-days" />
                <h3>날짜 선택</h3>
              </div>
              <p>체크인과 체크아웃 날짜를 선택해주세요</p>
            </div>

            <div className="calendar-row">
              <div className="calendar-box">
                <div className="calendar-label">
                  <i className="fa-solid fa-right-to-bracket" />
                  <p>체크인</p>
                </div>
                <DatePicker
                  selected={checkin}
                  onChange={handleCheckinChange}
                  minDate={new Date()}
                  filterDate={(d) => !isCheckinUnavailable(d)}
                  inline locale={ko}
                  dayClassName={(d) => isCheckinUnavailable(d) ? 'unavailable' : undefined}
                />
              </div>

              <div className="calendar-box">
                <div className="calendar-label">
                  <i className="fa-solid fa-right-from-bracket" />
                  <p>체크아웃</p>
                </div>
                <DatePicker
                  selected={checkout}
                  onChange={setCheckout}
                  minDate={checkin ? new Date(checkin.getTime() + 86400000) : new Date()}
                  maxDate={checkoutMaxDate}
                  filterDate={(d) => !isCheckoutUnavailable(d)}
                  inline locale={ko}
                  dayClassName={(d) => isCheckoutUnavailable(d) ? 'unavailable' : undefined}
                />
              </div>
            </div>

            <div className="calendar-legend">
              {[
                { cls: 'available',   label: '예약 가능' },
                { cls: 'unavailable', label: '예약 불가' },
                { cls: 'selected',    label: '선택한 날짜' },
              ].map(({ cls, label }) => (
                <div className="legend-item" key={cls}>
                  <div className={`legend-color ${cls}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="night-box">총 <span>{nights}</span>박 숙박</div>

            <div className="info-box">
              <p><i className="fa-solid fa-clock" /> 체크인: 오전 10시</p>
              <p><i className="fa-solid fa-clock" /> 체크아웃: 오후 6시</p>
              <p><i className="fa-solid fa-moon" /> 최소 예약: 1박</p>
              <p><i className="fa-solid fa-triangle-exclamation" /> 취소는 체크인 3일 전까지 가능합니다</p>
            </div>
          </div>

          {/* ─── 객실 상세 ─── */}
          <div className="reservation-detail">
            <img src={`/uploads/${room.img}`} className="room-detail-image" alt={room.roomType} />
            <h2 className="room-title">{room.roomType} Room</h2>
            <ul className="room-features">
              <li><i className="fa-solid fa-temperature-high" />개별 온도 조절 시스템</li>
              <li><i className="fa-solid fa-bed" />프리미엄 침구 & 매트리스</li>
              <li><i className="fa-solid fa-video" />24시간 CCTV 모니터링</li>
              <li><i className="fa-solid fa-dog" />전용 놀이 & 휴식 공간</li>
              <li><i className="fa-solid fa-broom" />매일 2회 위생 관리</li>
            </ul>
            <div className="price-box">
              {room.roomPrice.toLocaleString()}원
              <small>/ 1박</small>
            </div>
          </div>
        </div>

        {/* ─── 추가 서비스 ─── */}
        <div className="room-service">
          <h3 className="hotelservicetext">호텔 추가 서비스</h3>
          <ul className="service-list">
            {serviceList.map((svc) => (
              <li key={svc.serviceNo}>
                <div
                  className={`service-card${selectedServices.has(svc.serviceNo) ? ' selected' : ''}`}
                  onClick={() => toggleService(svc.serviceNo)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="service-top">
                    <div className="service-info">
                      <span className="service-icon">
                        <i className={`fa-solid ${serviceIconMap[svc.serviceName] || 'fa-star'}`} />
                      </span>
                      <span className="service-name">{svc.serviceName}</span>
                    </div>
                    <small className="service-price">+{svc.servicePrice.toLocaleString()}원</small>
                  </div>
                  <div className="service-bottom">
                    <p className="service-desc">{svc.description}</p>
                    <input
                      type="checkbox" className="service-checkbox" readOnly
                      checked={selectedServices.has(svc.serviceNo)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ─── 예약 요약 ─── */}
        <div className="payment-summary">
          <div className="summary-title">예약 요약</div>

          <div className="summary-row">
            <span>기간</span>
            <span>{checkin && checkout ? `${formatDate(checkin)} ~ ${formatDate(checkout)}` : '-'}</span>
          </div>
          <div className="summary-row">
            <span>객실 요금</span>
            <span>{roomTotal.toLocaleString()}원</span>
          </div>
          <div className="summary-row">
            <span>선택 서비스</span>
            <span>{serviceTotal.toLocaleString()}원</span>
          </div>

          {/* 쿠폰 선택 - 로그인한 경우만 표시 */}
          {userNo ? (
            <CouponSelect
              userNo={userNo}
              totalPrice={totalBeforeDiscount}
              onApply={handleCouponApply}
            />
          ) : (
            <div style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '8px 0' }}>
              🎟 로그인하면 쿠폰을 사용할 수 있어요!
            </div>
          )}

          {/* 할인 금액 표시 */}
          {discountAmount > 0 && (
            <div className="summary-row" style={{ color: '#e53e3e' }}>
              <span>🎟 쿠폰 할인</span>
              <span>-{discountAmount.toLocaleString()}원</span>
            </div>
          )}

          <div className="summary-divider" />

          <div className="summary-row total">
            <span>총 결제 금액</span>
            <span>{total.toLocaleString()}원</span>
          </div>

          <select value={petNo} onChange={(e) => setPetNo(e.target.value)} required>
            <option value="" disabled>반려견 선택</option>
            {pets.map((pet) => (
              <option key={pet.no} value={pet.no}>{pet.name}</option>
            ))}
          </select>

          <button className="summary-btn" onClick={handleReserve}>예약하기</button>
        </div>
      </div>
    </>
  );
}