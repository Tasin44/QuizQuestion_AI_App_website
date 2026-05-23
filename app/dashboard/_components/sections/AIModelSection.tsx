"use client";
const models = [
  { name: "GPT-4o", desc: "Most capable model for complex reasoning and creative tasks.", color: "#10a37f", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" stroke="#10a37f" strokeWidth="1.5" /><path d="M12 6v12M6 12h12" stroke="#10a37f" strokeWidth="1.5" strokeLinecap="round" /></svg> },
  { name: "Claude Pro", desc: "Best for nuanced analysis, writing, and thoughtful responses.", color: "#8b5cf6", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> },
  { name: "Google Gemini AI", desc: "Advanced multimodal AI for text, images, and code analysis.", color: "#4285f4", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" fill="#4285f4" /><circle cx="12" cy="12" r="4" fill="#4285f4" /></svg> },
];
export default function AIModelSection() {
  return (
    <section id="ai-models" style={{ padding: "80px 40px", textAlign: "center", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ color: "#ffffff", fontSize: "34px", fontWeight: 700, margin: "0 0 50px" }}>Choose Your AI Model</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {models.map((m) => (
          <div key={m.name} style={{ backgroundColor: "#111118", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px", textAlign: "center", transition: "all 0.3s ease", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${m.color}40`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${m.color}15`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ marginBottom: "18px", display: "flex", justifyContent: "center" }}>{m.icon}</div>
            <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 600, margin: "0 0 10px" }}>{m.name}</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>{m.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
