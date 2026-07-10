"use client";
import { useLanguage } from "../useLanguage";

export default function HeroSection() {
  const { t } = useLanguage();
  return (
    <section style={{ padding: "60px 40px 80px", display: "flex", gap: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px" }}>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", fontWeight: 500, margin: 0, letterSpacing: "1.5px", textTransform: "uppercase" }}>{t("WELCOME BACK")}</p>
        <h1 style={{ color: "#ffffff", fontSize: "42px", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
          {t("Your AI Homework Helper")}<br /><span style={{ color: "rgba(255,255,255,0.6)" }}>{t("Ask anything.")}</span>
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#16161e", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)", padding: "6px 6px 6px 20px", marginTop: "12px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></svg>
          <input type="text" placeholder={t("Ask me anything...")} style={{ flex: 1, backgroundColor: "transparent", border: "none", outline: "none", color: "#ffffff", fontSize: "14px", padding: "10px 0" }} />
          <button style={{ backgroundColor: "#4F46E5", border: "none", borderRadius: "10px", padding: "12px 24px", color: "#ffffff", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{t("Ask AI")} →</button>
        </div>
      </div>
      <div style={{ width: "440px", backgroundColor: "#111118", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: "#4F46E5", color: "#fff", fontSize: "12px", fontWeight: 600 }}>{t("Chat with AI")}</div>
          <div style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 500 }}>{t("History")}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg, #4F46E5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#fff", flexShrink: 0 }}>AI</div>
            <div style={{ backgroundColor: "#1a1a24", borderRadius: "10px", padding: "12px 16px", maxWidth: "85%" }}>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>{t("Hello! I'm your AI homework helper. I can help with math, science, history, and more.")}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", paddingLeft: "40px" }}>
            {[{icon: "📊", text: t("Solve equations")}, {icon: "📝", text: t("Write essays")}, {icon: "🔬", text: t("Explain concepts")}].map((item) => (
              <span key={item.text} style={{ padding: "6px 12px", borderRadius: "20px", backgroundColor: "rgba(79,70,229,0.1)", border: "1px solid rgba(79,70,229,0.2)", color: "rgba(255,255,255,0.6)", fontSize: "11px", fontWeight: 500 }}>{item.icon} {item.text}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <div style={{ backgroundColor: "#4F46E5", borderRadius: "10px", padding: "12px 16px", maxWidth: "85%" }}>
              <p style={{ color: "#ffffff", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>{t("Can you help me with calculus derivatives?")}</p>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#1a1a24", borderRadius: "10px", padding: "10px 14px" }}>
          <input type="text" placeholder={t("Type a message...")} disabled style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px" }} />
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#4F46E5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </div>
        </div>
      </div>
    </section>
  );
}
