"use client";
import { useLanguage } from "../useLanguage";
const features = [
  { icon: "🤖", title: "Homework AI", desc: "Get instant help with any homework question across all subjects." },
  { icon: "📸", title: "Image to Solution", desc: "Snap a photo of your problem and get step-by-step solutions." },
  { icon: "📚", title: "Smart Explanations", desc: "Understand concepts deeply with AI-powered explanations." },
  { icon: "✍️", title: "Essay & Writing Help", desc: "Get help writing, editing, and improving your essays." },
];
export default function CompanionSection() {
  const { t } = useLanguage();
  return (
    <section id="features" style={{ padding: "80px 20px", textAlign: "center", maxWidth: "1200px", margin: "0 auto" }}>
      <style>{`
        .companion-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (max-width: 640px) {
          .companion-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <h2 style={{ color: "#ffffff", fontSize: "clamp(22px, 5vw, 34px)", fontWeight: 700, margin: "0 0 8px" }}>{t("The Only AI Companion You Need to Succeed")}</h2>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", margin: "0 0 50px" }}>{t("Powered by the world's best AI models for learning")}</p>
      <div className="companion-grid">
        {features.map((f) => (
          <div key={f.title} style={{ backgroundColor: "#111118", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", padding: "28px", textAlign: "left", transition: "all 0.3s ease", cursor: "default" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(79,70,229,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(79,70,229,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", margin: "0 0 16px" }}>{f.icon}</div>
            <h3 style={{ color: "#ffffff", fontSize: "17px", fontWeight: 600, margin: "0 0 8px" }}>{t(f.title)}</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>{t(f.desc)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
