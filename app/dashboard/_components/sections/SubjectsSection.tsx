"use client";
const subjects = [
  { icon: "📐", label: "Math" }, { icon: "💻", label: "Coding" }, { icon: "🔬", label: "Physics" }, { icon: "🧪", label: "Chemistry" },
  { icon: "🧬", label: "Biology" }, { icon: "📖", label: "English" }, { icon: "🌍", label: "History" }, { icon: "📊", label: "Statistics" },
  { icon: "🎨", label: "Art" }, { icon: "🎵", label: "Music" }, { icon: "💰", label: "Economics" }, { icon: "🧠", label: "Psychology" },
  { icon: "📝", label: "Writing" }, { icon: "🌐", label: "Geography" }, { icon: "⚖️", label: "Law" }, { icon: "🏛️", label: "Philosophy" },
];
export default function SubjectsSection() {
  return (
    <section style={{ padding: "80px 40px", textAlign: "center", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ color: "#ffffff", fontSize: "34px", fontWeight: 700, margin: "0 0 8px" }}>Solve all subjects</h2>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", margin: "0 0 50px" }}>From math to literature, we cover every subject you need</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "16px" }}>
        {subjects.map((s) => (
          <div key={s.label} style={{ backgroundColor: "#111118", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)", padding: "24px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", transition: "all 0.3s ease", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(79,70,229,0.3)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <span style={{ fontSize: "28px" }}>{s.icon}</span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
