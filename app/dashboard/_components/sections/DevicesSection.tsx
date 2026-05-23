"use client";
export default function DevicesSection() {
  return (
    <section id="mobile-app" style={{ padding: "80px 40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "60px" }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: "#ffffff", fontSize: "34px", fontWeight: 700, margin: "0 0 6px", lineHeight: 1.2 }}>Quiz Question AI</h2>
          <h2 style={{ color: "#ffffff", fontSize: "34px", fontWeight: 700, margin: "0 0 24px", lineHeight: 1.2 }}>Is Available for All Devices</h2>
          <div style={{ display: "flex", gap: "12px" }}>
            <img src="/images/apple.png" alt="Get it on Google Play and App Store" style={{ height: "44px", objectFit: "contain", borderRadius: "8px" }} />
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <img src="/images/mockUp.png" alt="Quiz Question AI Mobile App" style={{ maxHeight: "500px", objectFit: "contain", filter: "drop-shadow(0 20px 60px rgba(79,70,229,0.15))" }} />
        </div>
      </div>
    </section>
  );
}
