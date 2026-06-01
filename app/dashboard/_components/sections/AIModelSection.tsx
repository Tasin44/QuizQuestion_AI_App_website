"use client";

const models = [
  {
    name: "GPT-4o",
    desc: "Most capable model for complex reasoning and creative tasks.",
    color: "#10a37f",
    image: "/images/gpt.png"
  },
  {
    name: "Claude Pro",
    desc: "Best for nuanced analysis, writing, and thoughtful responses.",
    color: "#d4a574",
    image: "/images/claude.png"
  },
  {
    name: "Google Gemini AI",
    desc: "Advanced multimodal AI for text, images, and code analysis.",
    color: "#4285f4",
    image: "/images/gemini.png"
  },
];

export default function AIModelSection() {
  return (
    <section id="ai-models" style={{ padding: "80px 20px", textAlign: "center", maxWidth: "1200px", margin: "0 auto" }}>
      <style>{`
        .ai-model-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .ai-model-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .ai-model-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <h2 style={{ color: "#ffffff", fontSize: "clamp(24px, 5vw, 34px)", fontWeight: 700, margin: "0 0 50px" }}>Choose Your AI Model</h2>
      <div className="ai-model-grid">
        {models.map((m) => {
          return (
            <div key={m.name} style={{ backgroundColor: "#111118", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px", textAlign: "center", transition: "all 0.3s ease", cursor: "pointer" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${m.color}40`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${m.color}15`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ marginBottom: "18px", display: "flex", justifyContent: "center" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "10px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a28" }}>
                  <img src={m.image} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
              </div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 600, margin: "0 0 10px" }}>{m.name}</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>{m.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
