import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function NoticeList() {
  const [notices, setNotices] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token.replace("Bearer ", ""));
        setIsAdmin(decoded.rol?.includes("ROLE_ADMIN") ?? false);
      } catch {}
    }
fetch("/api/notices", {
  headers: token ? { Authorization: token } : {},
})
  .then((r) => r.json())
  .then((data) => {
    // 배열인지 확인 후 세팅
    setNotices(data.noticeList ?? [])
    setLoading(false);
  })
  .catch(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <p style={styles.label}>NOTICE</p>
            <h2 style={styles.title}>공지사항</h2>
          </div>

        </div>

        <div style={styles.card}>
          {loading ? (
            <div style={styles.empty}>불러오는 중...</div>
          ) : notices.length === 0 ? (
            <div style={styles.empty}>등록된 공지사항이 없습니다.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: "10%" }}>번호</th>
                  <th style={{ ...styles.th, width: "60%", textAlign: "left", paddingLeft: "24px" }}>제목</th>
                  <th style={{ ...styles.th, width: "30%" }}>작성일</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice, i) => (
                  <tr key={notice.no} style={styles.tr}>
                    <td style={{ ...styles.td, color: "#9ca3af" }}>{notice.no}</td>
                    <td style={{ ...styles.td, textAlign: "left", paddingLeft: "24px" }}>
                      <Link
                        to={`/noticedetail/${notice.no}`}
                        style={styles.noticeLink}
                        onMouseEnter={(e) => (e.target.style.color = "#111827")}
                        onMouseLeave={(e) => (e.target.style.color = "#374151")}
                      >
                        {notice.title}
                      </Link>
                    </td>
                    <td style={{ ...styles.td, color: "#9ca3af", fontSize: "13px" }}>
                      {notice.regDate
                        ? new Date(notice.regDate).toLocaleDateString("ko-KR", {
                            year: "numeric", month: "2-digit", day: "2-digit",
                          })
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "24px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#9ca3af",
    letterSpacing: "0.12em",
    marginBottom: "4px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  writeBtn: {
    padding: "9px 18px",
    backgroundColor: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "14px 12px",
    backgroundColor: "#f9fafb",
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280",
    textAlign: "center",
    borderBottom: "1px solid #e5e7eb",
  },
  tr: {
    borderBottom: "1px solid #f3f4f6",
    transition: "background 0.15s",
  },
  td: {
    padding: "15px 12px",
    fontSize: "15px",
    color: "#374151",
    textAlign: "center",
  },
  noticeLink: {
    color: "#374151",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.15s",
  },
  empty: {
    textAlign: "center",
    padding: "60px 0",
    color: "#9ca3af",
    fontSize: "15px",
  },
};