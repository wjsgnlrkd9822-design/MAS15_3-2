// 활성 예약 조회 (현재 체크인~체크아웃 중인 예약)
export async function getActiveReservation() {
  const res = await fetch('/api/reservation/active');
  if (!res.ok) throw new Error('예약 조회 실패');
  return res.json(); // { success, reservation }
}

// 예약 등록
// roomNo: 객실 번호
// body: { checkin, checkout, nights, total, totalPrice, serviceIds, petNo }
export async function insertReservation(roomNo, body) {
  const res = await fetch(`/pet/reservation/insert/${roomNo}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('예약 등록 실패');
  return res.json();
}

// 특정 객실 예약 스케줄 조회 (예약된 날짜 목록)
export async function getRoomSchedule(roomNo) {
  const res = await fetch(`/api/room/${roomNo}/schedule`);
  if (!res.ok) throw new Error('스케줄 조회 실패');
  return res.json(); // { success, schedule: [{checkin, checkout}, ...] }
}