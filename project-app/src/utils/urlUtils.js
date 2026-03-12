// 유튜브 일반 URL → embed URL 변환
export function convertToEmbedUrl(url) {
  if (!url) return '';

  // 이미 embed URL인 경우
  if (url.includes('/embed/')) return url;

  // https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&mute=1`;
  }

  // https://www.youtube.com/live/VIDEO_ID
  const liveMatch = url.match(/\/live\/([^?]+)/);
  if (liveMatch) {
    return `https://www.youtube.com/embed/${liveMatch[1]}?autoplay=1&mute=1`;
  }

  return url;
}