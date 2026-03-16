import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// 글쓰기: /noticewrite
// 수정:   /noticeupdate/:no
export default function NoticeEdit() {
  const { no } = useParams();          // undefined이면 새 글쓰기
  const isEdit = !!no;
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  // 관리자 아니면 목록으로 튕겨냄
  useEffect(() => {
    const token = localStorage.getItem("token");
    try {
      const decoded = jwtDecode(token.replace("Bearer ", ""));
      if (!decoded.rol?.includes("ROLE_ADMIN")) {
        alert("관리자만 접근할 수 있습니다.");
        navigate("/noticelist");
      }
    } catch {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, []);

  // 수정 모드일 때 기존 내용 불러오기
  useEffect(() => {
    if (!isEdit) return;
    const token = localStorage.getItem("token");
    fetch(`/api/notices/${no}`, {
      headers: { Authorization: token },
    })
      .then((r) => r.json())
      .then((data) => {
  setForm({ title: data.notice.title, content: data.notice.content }); // ← data → data.notice
  setLoading(false);
})
      .catch(() => {
        alert("공지사항을 불러올 수 없습니다.");
        navigate("/noticelist");
      });
  }, [no]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
    };
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      let response;
      if (isEdit) {
        response = await fetch(`/noticeup/${no}`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(form),
        });
      } else {
        response = await fetch("/api/notices", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(form),
        });
      }
      const result = await response.text();
      if (result === "SUCCESS") {
        alert(isEdit ? "공지사항이 수정되었습니다." : "공지사항이 등록되었습니다.");
        navigate("/noticelist");
      } else {
        alert("처리 실패: " + result);
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/noticedelete/${no}`, {
        method: "DELETE",
        headers: token ? { Authorization: token } : {},
      });
      const result = await response.text();
      if (result === "SUCCESS") {
        alert("공지사항이 삭제되었습니다.");
        navigate("/noticelist");
      } else {
        alert("삭제 실패");
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.empty}>불러오는 중...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.header}>
          <p style={styles.label}>{isEdit ? "EDIT NOTICE" : "NEW NOTICE"}</p>
          <h2 style={styles.title}>{isEdit ? "공지사항 수정" : "공지사항 작성"}</h2>
        </div>

        <div style={styles.card}>

          {/* 제목 */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>제목</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="제목을 입력하세요"
              style={styles.input}
            />
          </div>

          {/* 내용 */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>내용</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              placeholder="내용을 입력하세요"
              rows={12}
              style={styles.textarea}
            />
          </div>

          {/* 버튼 */}
          <div style={styles.btnRow}>
            <button
              style={styles.cancelBtn}
              onClick={() => navigate(isEdit ? `/noticedetail/${no}` : "/noticelist")}
            >
              취소
            </button>

            <div style={{ display: "flex", gap: "8px" }}>
              {isEdit && (
                <button style={styles.deleteBtn} onClick={handleDelete}>
                  삭제하기
                </button>
              )}
              <button
                style={{ ...styles.submitBtn, opacity: submitting ? 0.6 : 1 }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "처리 중..." : isEdit ? "수정하기" : "등록하기"}
              </button>
            </div>
          </div>

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
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    padding: "36px 40px",
  },
  fieldGroup: {
    marginBottom: "20px",
  },
  fieldLabel: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    color: "#111827",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
  textarea: {
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    color: "#111827",
    outline: "none",
    resize: "none",
    boxSizing: "border-box",
    lineHeight: "1.7",
    fontFamily: "inherit",
  },
  btnRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "28px",
  },
  cancelBtn: {
    padding: "10px 20px",
    backgroundColor: "#fff",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "10px 20px",
    backgroundColor: "#fff",
    color: "#ef4444",
    border: "1px solid #fca5a5",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  submitBtn: {
    padding: "10px 24px",
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