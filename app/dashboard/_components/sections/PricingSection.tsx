"use client";
const plans = [
  { 
    name: "Monthly Plan", 
    price: "$7.99", 
    period: "/month", 
    features: [
      { text: "Unlimited AI questions", ok: true }, 
      { text: "All AI models (GPT-4o, Claude, Gemini)", ok: true }, 
      { text: "Photo to Solution", ok: true },
      { text: "Unlimited history", ok: true }, 
      { text: "Priority support", ok: true },
    ], 
    btn: "Get Started", 
    filled: false 
  },
  { 
    name: "3-Monthly  Plan", 
    price: "$19.99", 
    period: "/3-months", 
    features: [
      { text: "Unlimited AI questions", ok: true }, 
      { text: "All AI models (GPT-4o, Claude, Gemini)", ok: true }, 
      { text: "Photo to Solution", ok: true },
      { text: "Unlimited history", ok: true }, 
      { text: "Priority support", ok: true },
    ], 
    btn: "Upgrade to Pro", 
    filled: true, 
    popular: true 
  },
  { 
    name: "Annual Plan", 
    price: "$59.99", 
    period: "/year", 
    features: [
      { text: "Unlimited AI questions", ok: true }, 
      { text: "All AI models (GPT-4o, Claude, Gemini)", ok: true }, 
      { text: "Photo to Solution", ok: true },
      { text: "Unlimited history", ok: true }, 
      { text: "Priority support", ok: true },
    ], 
    btn: "Save Big", 
    filled: false 
  },
];
export default function PricingSection() {
  return (
    <section id="pricing" style={{ padding: "80px 20px", textAlign: "center", maxWidth: "1100px", margin: "0 auto" }}>
      <style>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
      <h2 style={{ color: "#ffffff", fontSize: "clamp(22px, 5vw, 34px)", fontWeight: 700, margin: "0 0 50px" }}>Start for free. Upgrade anytime.</h2>
      <div className="pricing-grid">
        {plans.map((p) => (
          <div key={p.name} style={{ backgroundColor: "#111118", borderRadius: "16px", border: p.popular ? "1px solid rgba(79,70,229,0.4)" : "1px solid rgba(255,255,255,0.06)", padding: "36px 24px", textAlign: "left", position: "relative", transition: "all 0.3s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
            {p.popular && <div style={{ position: "absolute", top: "-12px", right: "24px", backgroundColor: "#4F46E5", color: "#fff", fontSize: "11px", fontWeight: 600, padding: "4px 14px", borderRadius: "20px" }}>Popular</div>}
            <h3 style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", fontWeight: 600, margin: "0 0 6px" }}>{p.name}</h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "28px" }}>
              <span style={{ color: "#ffffff", fontSize: "clamp(30px, 6vw, 40px)", fontWeight: 700 }}>{p.price}</span>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px" }}>{p.period}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
              {p.features.map((f) => (
                <div key={f.text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {f.ok ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  )}
                  <span style={{ color: f.ok ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.25)", fontSize: "13px" }}>{f.text}</span>
                </div>
              ))}
            </div>
            <button style={{ width: "100%", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease", backgroundColor: p.filled ? "#4F46E5" : "transparent", border: p.filled ? "none" : "1px solid rgba(255,255,255,0.15)", color: p.filled ? "#ffffff" : "rgba(255,255,255,0.6)" }}>{p.btn}</button>
          </div>
        ))}
      </div>
    </section>
  );
}
