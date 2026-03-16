import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function NoticeDetail() {
  const { no } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token.replace("Bearer ", ""));
        setIsAdmin(decoded.rol?.includes("ROLE_ADMIN") ?? false);
      } catch {}
    }

    fetch(`/api/notices/${no}`, {
      headers: token ? { Authorization: token } : {},
    })
      .then((r) => r.json())
   .then((data) => {
  setNotice(data.notice);  // ← data → data.notice
  setLoading(false);
})
      .catch(() => {
        alert("공지사항을 불러올 수 없습니다.");
        navigate("/noticelist");
      });
  }, [no]);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.empty}>불러오는 중...</div>
      </div>
    );
  }

  if (!notice) return null;

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* 상단 네비 */}
        <div style={styles.breadcrumb}>
          <Link to="/noticelist" style={styles.breadLink}>공지사항</Link>
          <span style={styles.breadSep}>/</span>
          <span style={{ color: "#374151" }}>상세보기</span>
        </div>

        <div style={styles.card}>
          {/* 제목 + 날짜 */}
          <div style={styles.cardHeader}>
            <h2 style={styles.noticeTitle}>{notice.title}</h2>
            <span style={styles.date}>
              {notice.regDate
                ? new Date(notice.regDate).toLocaleString("ko-KR", {
                    year: "numeric", month: "2-digit", day: "2-digit",
                    hour: "2-digit", minute: "2-digit",
                  })
                : ""}
            </span>
          </div>

          <hr style={styles.divider} />

          {/* 내용 */}
          <div style={styles.content}>{notice.content}</div>
        </div>

        {/* 버튼 영역 */}
        <div style={styles.btnRow}>
          <button style={styles.backBtn} onClick={() => navigate("/noticelist")}>
            ← 목록으로
          </button>
          {isAdmin && (
            <button
              style={styles.editBtn}
              onClick={() => navigate(`/noticeupdate/${notice.no}`)}
            >
              수정하기
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    paddingTop: "60px",
    paddingBottom: "60px",
  },
  container: {
    maxWidth: "860px",
    margin: "0 auto",
    padding: "0 20px",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    color: "#9ca3af",
  },
  breadLink: {
    color: "#6b7280",
    textDecoration: "none",
  },
  breadSep: { color: "#d1d5db" },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    padding: "36px 40px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },
  noticeTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
    flex: 1,
  },
  date: {
    fontSize: "13px",
    color: "#9ca3af",
    whiteSpace: "nowrap",
    marginTop: "4px",
  },
  divider: {
    margin: "20px 0",
    border: "none",
    borderTop: "1px solid #e5e7eb",
  },
  content: {
    fontSize: "15px",
    lineHeight: "1.8",
    color: "#374151",
    whiteSpace: "pre-wrap",
    minHeight: "200px",
  },
  btnRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  backBtn: {
    padding: "10px 20px",
    backgroundColor: "#fff",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  editBtn: {
    padding: "10px 20px",
    backgroundColor: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    padding: "80px 0",
    color: "#9ca3af",
  },
};