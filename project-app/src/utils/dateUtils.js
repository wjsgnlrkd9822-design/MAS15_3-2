// 날짜를 "YYYY.MM.DD" 형식으로 포맷
export function formatDate(d) {
  if (!d) return '-';
  return (
    d.getFullYear() +
    '.' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '.' +
    String(d.getDate()).padStart(2, '0')
  );
}

// 날짜를 "YYYY-MM-DD" 형식으로 포맷 (서버 전송용)
export function formatLocalDate(d) {
  if (!d) return '';
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

// 서버에서 배열 [2025, 2, 20] 또는 문자열 "2025-02-20" 형태로 오는 날짜를 "YYYY-MM-DD" 문자열로 변환
export function normalizeDateStr(raw) {
  if (Array.isArray(raw)) {
    return `${raw[0]}-${String(raw[1]).padStart(2, '0')}-${String(raw[2]).padStart(2, '0')}`;
  }
  return raw; // 이미 문자열
}

// 예약 데이터의 체크인/체크아웃으로부터 "불가 날짜 배열" 계산
// checkinUnavailable: 예약 시작일 하루 전 ~ 종료일
// checkoutUnavailable: 예약 시작일 ~ 종료일
export function computeUnavailableDates(reservations) {
  const checkinUnavailable = [];
  const checkoutUnavailable = [];

  reservations.forEach((res) => {
    const startStr = normalizeDateStr(res.checkin);
    const endStr = normalizeDateStr(res.checkout);

    const [sy, sm, sd] = startStr.split('-').map(Number);
    const [ey, em, ed] = endStr.split('-').map(Number);

    const start = new Date(sy, sm - 1, sd);
    const end = new Date(ey, em - 1, ed);

    // 체크인 불가: 시작일 하루 전 ~ 종료일
    const dayBefore = new Date(start);
    dayBefore.setDate(dayBefore.getDate() - 1);

    for (let d = new Date(dayBefore); d <= end; d.setDate(d.getDate() + 1)) {
      checkinUnavailable.push(formatLocalDate(new Date(d)));
    }

    // 체크아웃 불가: 시작일 ~ 종료일
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      checkoutUnavailable.push(formatLocalDate(new Date(d)));
    }
  });

  return { checkinUnavailable, checkoutUnavailable };
}

// 박수 계산
export function calcNights(checkin, checkout) {
  if (!checkin || !checkout) return 0;
  return Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
}