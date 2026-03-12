import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <section className="footer-section">
          <img src="/img/logo.png" alt="로고" />
          <p>사랑하는 반려견을 위한 최고의<br /> 호텔 서비스를 제공합니다</p>
        </section>

        <section className="footer-section">
          <p className="footer-title">빠른 링크</p>
          <p><Link to="/pet/reservation">예약</Link></p>
          <p><Link to="/noticelist">공지사항</Link></p>
          <p><Link to="/service">서비스 안내</Link></p>
          <p><Link to="/pet/introduce">호텔 소개</Link></p>
        </section>

        <section className="footer-section">
          <p className="footer-title">고객센터</p>
          <p>전화 : 02-1234-5678</p>
          <p>이메일 : info@doghotel.com</p>
          <p>운영시간 : 09:00 ~ 18:00</p>
          <p>연중무휴</p>
        </section>

        <section className="footer-section">
          <p className="footer-title">찾아 오시는길</p>
          
            <a href="https://map.naver.com/p/directions/-/14106470.8171145,4507773.8519413,%EB%8D%94%EC%A1%B0%EC%9D%80%EC%BB%B4%ED%93%A8%ED%84%B0%EC%95%84%EC%B9%B4%EB%8D%B0%EB%AF%B8%ED%95%99%EC%9B%90%20%EC%9D%B8%EC%B2%9C%EC%A0%90,1516930945,PLACE_POI/-/transit?c=14.69,0,0,0,dh"
            target="_blank"
            rel="noreferrer"
          >
            서울 특별시 강남구 테헤란로 123 PETHOUSE 빌딩 5층
          </a>
        </section>

      </div>
      <div className="footer-bottom">
        © 2026 PETHOUSE. All rights reserved.
      </div>
    </footer>
  );
}