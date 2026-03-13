import { useState, useEffect, useRef } from "react";

const QUICK_CHIPS = [
  { label: "💰 요금 안내", text: "객실 요금이 어떻게 되나요?" },
  { label: "📅 예약 가능 여부", text: "지금 예약 가능한 방 있나요?" },
  { label: "🛁 서비스 목록", text: "어떤 부가 서비스가 있나요?" },
  { label: "🐕 대형견 문의", text: "대형견도 예약 가능한가요?" },
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "안녕하세요! 🐾 PETHOUSE 상담 챗봇입니다.\n예약, 요금, 서비스 등 무엇이든 물어보세요!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const [hasNew, setHasNew] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setHasNew(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);
    setChipsVisible(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply || "답변을 불러올 수 없습니다." },
      ]);
      if (!open) setHasNew(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── 플로팅 버튼 ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="chatbot-toggle"
        aria-label="챗봇 열기"
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          background: open ? "#c97c3a" : "#f4a261",
          border: "none",
          cursor: "pointer",
          zIndex: 1100,
          boxShadow: "0 4px 18px rgba(244,162,97,0.45)",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s, transform 0.2s",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
        }}
      >
        {open ? "✕" : "🐾"}
        {hasNew && !open && (
          <span
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              width: "14px",
              height: "14px",
              background: "#e05c2e",
              borderRadius: "50%",
              border: "2px solid #fff",
            }}
          />
        )}
      </button>

      {/* ── 채팅창 ── */}
      <div
        style={{
          position: "fixed",
          bottom: "100px",
          right: "28px",
          width: "360px",
          maxWidth: "calc(100vw - 40px)",
          height: "520px",
          maxHeight: "calc(100vh - 130px)",
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 1099,
          transformOrigin: "bottom right",
          transform: open ? "scale(1) translateY(0)" : "scale(0.88) translateY(16px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease",
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            background: "linear-gradient(135deg, #f4a261, #e07c3a)",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            🐶
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: "14px" }}>
              PETHOUSE 상담봇
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", marginTop: "1px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#a8f0c0",
                  marginRight: "4px",
                  verticalAlign: "middle",
                }}
              />
              AI 도우미 운영 중
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.85)",
              fontSize: "18px",
              cursor: "pointer",
              lineHeight: 1,
              padding: "2px 4px",
            }}
          >
            ✕
          </button>
        </div>

        {/* 메시지 영역 */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            background: "#fdf7f2",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: "7px",
              }}
            >
              {msg.role === "bot" && (
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: "#fde0c4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    flexShrink: 0,
                  }}
                >
                  🐾
                </div>
              )}
              <div
                style={{
                  maxWidth: "76%",
                  padding: "9px 13px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.role === "user" ? "#f4a261" : "#fff",
                  color: msg.role === "user" ? "#fff" : "#2a2a2a",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  border: msg.role === "bot" ? "1px solid #f0e0d0" : "none",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* 타이핑 인디케이터 */}
          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "7px" }}>
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "#fde0c4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  flexShrink: 0,
                }}
              >
                🐾
              </div>
              <div
                style={{
                  padding: "10px 14px",
                  background: "#fff",
                  borderRadius: "16px 16px 16px 4px",
                  border: "1px solid #f0e0d0",
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map((n) => (
                  <span
                    key={n}
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#f4a261",
                      display: "inline-block",
                      animation: "chatbotBounce 1.2s infinite",
                      animationDelay: `${n * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 빠른 질문 칩 */}
        {chipsVisible && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              padding: "8px 14px 4px",
              background: "#fdf7f2",
              flexShrink: 0,
            }}
          >
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => sendMessage(chip.text)}
                style={{
                  background: "#fff",
                  border: "1px solid #f4c095",
                  color: "#c97c3a",
                  fontSize: "12px",
                  padding: "5px 11px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#f4a261";
                  e.target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#fff";
                  e.target.style.color = "#c97c3a";
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* 입력창 */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "10px 12px",
            background: "#fff",
            borderTop: "1px solid #f0e8e0",
            flexShrink: 0,
            alignItems: "center",
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="메시지를 입력하세요..."
            style={{
              flex: 1,
              border: "1px solid #f0d8c0",
              borderRadius: "22px",
              padding: "9px 14px",
              fontSize: "13px",
              fontFamily: "inherit",
              outline: "none",
              background: "#fdf7f2",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#f4a261")}
            onBlur={(e) => (e.target.style.borderColor = "#f0d8c0")}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: input.trim() && !loading ? "#f4a261" : "#f0d8c0",
              border: "none",
              cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s",
              fontSize: "16px",
            }}
          >
            ➤
          </button>
        </div>
      </div>

      {/* 바운스 애니메이션 */}
      <style>{`
        @keyframes chatbotBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}