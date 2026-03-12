import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRoomSearch } from '../../hooks/useRoomSearch';
import '../../assets/reservation.css'

// ──────────────────────────────────────────────
//  객실 리스트 페이지
//  Thymeleaf reservation.html → React 변환
// ──────────────────────────────────────────────
export default function RoomListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { rooms, count, loading, loadAll, search, reset } = useRoomSearch();

  // 필터 상태
  const [checkin, setCheckin]   = useState(searchParams.get('checkin') || '');
  const [checkout, setCheckout] = useState(searchParams.get('checkout') || '');
  const [sizeType, setSizeType] = useState(searchParams.get('sizeType') || 'all');
  const [sort, setSort]         = useState(searchParams.get('sort') || 'default');

  const today = new Date().toISOString().split('T')[0];

  // 초기 로딩 - 전체 객실 바로 표시
  useEffect(() => {
    loadAll();
  }, []);

  // 필터 변경될 때마다 자동 검색
  useEffect(() => {
    search({ checkin, checkout, sizeType, sort });
  }, [sizeType, sort]);

  const handleSearch = () => search({ checkin, checkout, sizeType, sort });

  const handleReset = () => {
    setCheckin(''); setCheckout('');
    setSizeType('all'); setSort('default');
    reset();
  };

  const handleCheckinChange = (val) => {
    setCheckin(val);
    if (val && checkout && new Date(checkout) <= new Date(val)) {
      const next = new Date(val);
      next.setDate(next.getDate() + 1);
      setCheckout(next.toISOString().split('T')[0]);
    }
  };

  return (
    <>
      <div className="page-bg" />
      <p className="reservation-text">Room List</p>

      <div className="search-and-results-container">
        {/* ─── 왼쪽 사이드바 필터 ─── */}
        <aside className="integrated-search-section">
          <div className="search-title">맞춤 객실 검색</div>
          <div className="search-form-container">

            {/* 체크인/아웃 */}
            <div className="date-row">
              <div className="filter-group-integrated">
                <label className="group-label">체크인</label>
                <input
                  type="date"
                  className="date-input-integrated"
                  min={today}
                  value={checkin}
                  onChange={(e) => handleCheckinChange(e.target.value)}
                />
              </div>
              <div className="filter-group-integrated">
                <label className="group-label">체크아웃</label>
                <input
                  type="date"
                  className="date-input-integrated"
                  min={checkin ? (() => { const d = new Date(checkin); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0]; })() : today}
                  value={checkout}
                  onChange={(e) => setCheckout(e.target.value)}
                />
              </div>
            </div>

            {/* 견종 / 가격 */}
            <div className="filter-row">
              <div className="filter-group-integrated">
                <label className="group-label">견종</label>
                <div className="chip-container-integrated">
                  {['all', '소형견', '중형견', '대형견'].map((v) => (
                    <label className="filter-chip-integrated" key={v}>
                      <input type="radio" name="sizeType" value={v} checked={sizeType === v} onChange={() => setSizeType(v)} />
                      <span>{v === 'all' ? '전체' : v}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-group-integrated">
                <label className="group-label">가격</label>
                <div className="chip-container-integrated">
                  {[{ v: 'default', label: '기본' }, { v: 'priceAsc', label: '저렴한 순' }, { v: 'priceDesc', label: '비싼 순' }].map(({ v, label }) => (
                    <label className="filter-chip-integrated" key={v}>
                      <input type="radio" name="sort" value={v} checked={sort === v} onChange={() => setSort(v)} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="search-buttons">
              <button className="search-btn-integrated" onClick={handleSearch}>검색하기</button>
              <button className="reset-btn-integrated" onClick={handleReset}>초기화</button>
            </div>
          </div>

          {count !== null && (
            <div className="search-result-info">
              <strong>{count}</strong>
              <div>개의 객실</div>
            </div>
          )}
        </aside>

        {/* ─── 오른쪽 객실 목록 ─── */}
        <main className="room-list-section">
          {loading && (
            <div className="loading-overlay active">
              <div className="loading-spinner" />
            </div>
          )}

          <div className="room-grid">
            {rooms.length === 0 && !loading ? (
              <div className="empty-result">
                <div className="empty-result-icon">😔</div>
                <div className="empty-result-title">검색 결과가 없습니다</div>
                <div className="empty-result-desc">다른 조건으로 검색해보세요</div>
              </div>
            ) : (
              rooms.map((room) => {
                const url = checkin && checkout
                  ? `/pet/reservation/${room.roomNo}?checkin=${checkin}&checkout=${checkout}`
                  : `/pet/reservation/${room.roomNo}`;
                return (
                  <div
                    key={room.roomNo}
                    className="reservation-card-link"
                    onClick={() => navigate(url)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="reservation-card">
                      <div className="card-image-wrapper">
                        <img src={`/uploads/${room.img}`} className="room-image" alt={room.roomType} />
                        <div className="status-badge available">예약 가능</div>
                      </div>
                      <div className="card-content">
                        <div className="card-header-row">
                          <p className="room-type">{room.roomType}</p>
                        </div>
                        <p className="room-desc">{room.etc}</p>
                        <div className="card-footer-row">
                          <div className="price-box">
                            <span className="price-label">1박</span>
                            <span className="room-price">
                              <span>{room.roomPrice.toLocaleString()}</span>
                              <span className="currency">원</span>
                            </span>
                          </div>
                          <span className="reserve-btn">예약하기</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </>
  );
}
