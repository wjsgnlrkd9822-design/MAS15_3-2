import { useState, useEffect } from 'react';
import { getRoomSchedule } from '../apis/reservationApi';
import { computeUnavailableDates } from '../utils/dateUtils';

export function useRoomSchedule(roomNo) {
  const [reservations, setReservations] = useState([]);
  const [checkinUnavailable, setCheckinUnavailable] = useState([]);
  const [checkoutUnavailable, setCheckoutUnavailable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomNo) return;

    getRoomSchedule(roomNo)
      .then((data) => {
        if (data.success && data.schedule) {
          setReservations(data.schedule);
          const { checkinUnavailable, checkoutUnavailable } =
            computeUnavailableDates(data.schedule);
          setCheckinUnavailable(checkinUnavailable);
          setCheckoutUnavailable(checkoutUnavailable);
        }
      })
      .catch((err) => console.error('스케줄 조회 실패:', err))
      .finally(() => setLoading(false));
  }, [roomNo]);

  // 체크인 날짜 이후 첫 번째 예약 시작일 반환 (체크아웃 maxDate 설정용)
  function findNextReservationStart(checkinDate) {
    if (!checkinDate) return null;
    let nearest = null;
    reservations.forEach((res) => {
      const start = Array.isArray(res.checkin)
        ? new Date(res.checkin[0], res.checkin[1] - 1, res.checkin[2])
        : new Date(res.checkin);
      if (start > checkinDate) {
        if (!nearest || start < nearest) nearest = start;
      }
    });
    return nearest;
  }

  // 날짜 겹침 검증 (예약하기 버튼 클릭 시)
  function validateDates(checkin, checkout) {
    return reservations.every((res) => {
      const resCheckin = Array.isArray(res.checkin)
        ? new Date(res.checkin[0], res.checkin[1] - 1, res.checkin[2])
        : new Date(res.checkin);
      const resCheckout = Array.isArray(res.checkout)
        ? new Date(res.checkout[0], res.checkout[1] - 1, res.checkout[2])
        : new Date(res.checkout);
      return !(checkin < resCheckout && checkout > resCheckin);
    });
  }

  return {
    reservations,
    checkinUnavailable,
    checkoutUnavailable,
    loading,
    findNextReservationStart,
    validateDates,
  };
}