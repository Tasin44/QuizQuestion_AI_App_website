"use client";
import { useLanguage } from "../useLanguage";
const subjects = [
  { icon: "📐", label: "Math" }, { icon: "💻", label: "Coding" }, { icon: "🔬", label: "Physics" }, { icon: "🧪", label: "Chemistry" },
  { icon: "🧬", label: "Biology" }, { icon: "📖", label: "English" }, { icon: "🌍", label: "History" }, { icon: "📊", label: "Statistics" },
  { icon: "🎨", label: "Art" }, { icon: "🎵", label: "Music" }, { icon: "💰", label: "Economics" }, { icon: "🧠", label: "Psychology" },
  { icon: "📝", label: "Writing" }, { icon: "🌐", label: "Geography" }, { icon: "⚖️", label: "Law" }, { icon: "🏛️", label: "Philosophy" },
];
export default function SubjectsSection() {
  const { t } = useLanguage();
  return (
    <section style={{ padding: "80px 20px", textAlign: "center", maxWidth: "1200px", margin: "0 auto" }}>
      <style>{`
        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .subjects-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
          }
        }
        @media (max-width: 500px) {
          .subjects-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
        }
      `}</style>
      <h2 style={{ color: "#ffffff", fontSize: "clamp(22px, 5vw, 34px)", fontWeight: 700, margin: "0 0 8px" }}>{t("Solve all subjects")}</h2>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", margin: "0 0 50px" }}>{t("From math to literature, we cover every subject you need")}</p>
      <div className="subjects-grid">
        {subjects.map((s) => (
          <div key={s.label} style={{ backgroundColor: "#111118", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)", padding: "20px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", transition: "all 0.3s ease", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(79,70,229,0.3)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <span style={{ fontSize: "24px" }}>{s.icon}</span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", fontWeight: 500 }}>{t(s.label)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
