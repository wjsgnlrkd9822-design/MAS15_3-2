import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [auth, setAuth] = useState({ isLogin: false, isAdmin: false });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/auth/status")
      .then((res) => res.json())
      .then((data) => setAuth(data))
      .catch(() => setAuth({ isLogin: false, isAdmin: false }));
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    await fetch("/logout", { method: "POST" });
    setAuth({ isLogin: false, isAdmin: false });
    navigate("/");
  };

  return (
    <header>
      <Link to="/">
        <img src="/img/logo.png" alt="로고" />
      </Link>

      <ul>
        <li><Link to="/pet/reservation">예약</Link></li>
        <li><Link to="/noticelist">공지사항</Link></li>
        <li><Link to="/service">서비스</Link></li>
        <li><Link to="/pet/introduce">소개</Link></li>
      </ul>

      <ul>
        {!auth.isLogin && (
          <>
            <li className="login"><Link to="/login">로그인</Link></li>
            <li className="login"><Link to="/join">회원가입</Link></li>
          </>
        )}
        {auth.isAdmin && (
          <li className="login"><Link to="/admin">관리자 페이지</Link></li>
        )}
        {auth.isLogin && (
          <>
            <li className="login"><Link to="/mypage">마이페이지</Link></li>
            <li className="login">
              <a href="#" onClick={handleLogout}>로그아웃</a>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}