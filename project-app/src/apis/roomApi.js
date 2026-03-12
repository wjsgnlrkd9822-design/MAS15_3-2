// 전체 객실 목록 조회 (초기 로딩)
export async function getRooms() {
  const res = await fetch('/api/rooms');
  if (!res.ok) throw new Error('객실 목록 조회 실패');
  return res.json(); // { success, rooms }
}

// 조건 검색
// params: { checkin, checkout, sizeType, sort }
export async function searchRooms(params) {
  const query = new URLSearchParams();
  if (params.checkin) query.append('checkin', params.checkin);
  if (params.checkout) query.append('checkout', params.checkout);
  if (params.sizeType && params.sizeType !== 'all') query.append('sizeType', params.sizeType);
  if (params.sort && params.sort !== 'default') query.append('sort', params.sort);

  const res = await fetch(`/api/rooms/search?${query.toString()}`);
  if (!res.ok) throw new Error('검색 실패');
  return res.json(); // { success, rooms, count }
}

// 단일 객실 상세 조회
export async function getRoomDetail(roomNo) {
  const res = await fetch(`/api/rooms/${roomNo}`);
  if (!res.ok) throw new Error('객실 상세 조회 실패');
  return res.json(); // { success, room, roomServiceList, pets }
}