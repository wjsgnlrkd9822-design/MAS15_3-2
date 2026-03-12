export async function getNotices() {
  const res = await fetch('/api/notices');
  if (!res.ok) throw new Error('공지사항 조회 실패');
  return res.json();
}

export async function getNoticeDetail(no) {
  const res = await fetch(`/api/notices/${no}`);
  if (!res.ok) throw new Error('공지사항 상세 조회 실패');
  return res.json();
}