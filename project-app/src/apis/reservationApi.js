// 활성 예약 조회
export async function getActiveReservation() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/reservation/active', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('예약 조회 실패');
  return res.json();
}

// 예약 등록
export async function insertReservation(roomNo, body) {
  const token = localStorage.getItem('token');

  const params = new URLSearchParams();
  params.append('checkin', body.checkin);
  params.append('checkout', body.checkout);
  params.append('petNo', body.petNo);
  params.append('totalPrice', body.totalPrice);
  params.append('nights', body.nights);
  if (body.couponNo) params.append('couponNo', body.couponNo);
  if (body.discount) params.append('discount', body.discount);
  if (body.serviceIds) {
    body.serviceIds.split(',').filter(Boolean).forEach(id => params.append('serviceIds', id));
  }

  const res = await fetch(`/pet/reservation/insert/${roomNo}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`
    },
    body: params.toString(),
  });

  // 리다이렉트 응답도 성공으로 처리
  if (res.ok || res.redirected || res.status === 302) {
    return { success: true };
  }
  throw new Error('예약 등록 실패');
}

// 특정 객실 예약 스케줄 조회
export async function getRoomSchedule(roomNo) {
  const res = await fetch(`/api/room/${roomNo}/schedule`);
  if (!res.ok) throw new Error('스케줄 조회 실패');
  return res.json();
}

// 내 반려견 목록 조회
export async function getMyPets() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/pets/list', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('반려견 조회 실패');
  return res.json();
}