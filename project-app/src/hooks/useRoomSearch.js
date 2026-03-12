import { useState, useCallback } from 'react';
import { searchRooms as searchRoomsApi, getRooms } from '../apis/roomApi';

export function useRoomSearch() {
  const [rooms, setRooms] = useState([]);
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 초기 전체 목록 로드
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRooms();
      if (data.success) {
        setRooms(data.rooms);
        setCount(null);
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // 조건 검색
  const search = useCallback(async (params) => {
    // 날짜 유효성 검사
    if (params.checkin && params.checkout) {
      if (new Date(params.checkout) <= new Date(params.checkin)) {
        alert('체크아웃 날짜는 체크인 날짜보다 이후여야 합니다.');
        return;
      }
    }

    setLoading(true);
    try {
      const data = await searchRoomsApi(params);
      if (data.success) {
        setRooms(data.rooms);
        setCount(data.count);
      }
    } catch (e) {
      setError(e);
      alert('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 초기화 (전체 목록으로 복귀)
  const reset = useCallback(() => {
    setCount(null);
    loadAll();
  }, [loadAll]);

  return { rooms, setRooms, count, loading, error, loadAll, search, reset };
}
