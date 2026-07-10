"use client";
import { useLanguage } from "../useLanguage";
const cards = [
  { tag: "Just Chat", tagColor: "#22c55e", title: "Natural Language", desc: "Talk to AI like you would to a tutor. Ask questions naturally and get clear explanations.", gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" },
  { tag: "Multi Platform", tagColor: "#f59e0b", title: "Access Anywhere", desc: "Use on your phone, tablet, or computer. Your conversations sync across all devices.", gradient: "linear-gradient(135deg, #1a1a2e 0%, #1e1e3e 100%)" },
  { tag: "Smart Features", tagColor: "#8b5cf6", title: "AI-Powered Tools", desc: "From solving equations to writing essays, our AI tools cover every academic need.", gradient: "linear-gradient(135deg, #1a1a2e 0%, #2d1b3d 100%)" },
];
export default function RevolutionSection() {
  const { t } = useLanguage();
  return (
    <section style={{ padding: "80px 20px", textAlign: "center", maxWidth: "1200px", margin: "0 auto" }}>
      <style>{`
        .revolution-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .revolution-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .revolution-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <h2 style={{ color: "#ffffff", fontSize: "clamp(22px, 5vw, 34px)", fontWeight: 700, margin: "0 0 50px" }}>{t("Embrace the AI revolution")}</h2>
      <div className="revolution-grid">
        {cards.map((c) => (
          <div key={c.title} style={{ background: c.gradient, borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", padding: "28px", textAlign: "left", transition: "all 0.3s ease", cursor: "default", overflow: "hidden", position: "relative" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
            <span style={{ display: "inline-block", padding: "5px 12px", borderRadius: "20px", backgroundColor: `${c.tagColor}18`, color: c.tagColor, fontSize: "11px", fontWeight: 600, marginBottom: "18px" }}>{t(c.tag)}</span>
            <h3 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 600, margin: "0 0 10px" }}>{t(c.title)}</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0, lineHeight: 1.7 }}>{t(c.desc)}</p>
            <div style={{ position: "absolute", bottom: "-30px", right: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: `radial-gradient(circle, ${c.tagColor}12 0%, transparent 70%)`, pointerEvents: "none" }} />
          </div>
        ))}
      </div>
    </section>
  );
}
