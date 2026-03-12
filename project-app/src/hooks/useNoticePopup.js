import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'noticeNoShowDate';

export function useNoticePopup(noticeList = []) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 오늘 하루 열지 않기 여부 확인
  function shouldShow() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return true;
    return saved !== new Date().toDateString();
  }

  // 페이지 로드 시 자동 팝업
  useEffect(() => {
    if (noticeList.length > 0 && shouldShow()) {
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [noticeList.length]);

  // 자동 슬라이드
  useEffect(() => {
    if (!isOpen || noticeList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % noticeList.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen, noticeList.length]);

  const open = useCallback(() => {
    setIsOpen(true);
    setCurrentIndex(0);
  }, []);

  const close = useCallback((noShowToday = false) => {
    if (noShowToday) {
      localStorage.setItem(STORAGE_KEY, new Date().toDateString());
    }
    setIsOpen(false);
  }, []);

  const goTo = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  return { isOpen, currentIndex, open, close, goTo };
}
