"use client";
export default function DevicesSection() {
  return (
    <section id="mobile-app" style={{ padding: "80px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <style>{`
        .devices-layout {
          display: flex;
          align-items: center;
          gap: 60px;
        }
        .devices-text {
          flex: 1;
        }
        .devices-image {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        .devices-image img {
          max-height: 500px;
          object-fit: contain;
          filter: drop-shadow(0 20px 60px rgba(79,70,229,0.15));
        }
        @media (max-width: 768px) {
          .devices-layout {
            flex-direction: column;
            gap: 40px;
            text-align: center;
          }
          .devices-text h2 {
            font-size: 26px !important;
          }
          .devices-image img {
            max-height: 350px;
            width: 100%;
          }
          .devices-store-row {
            justify-content: center !important;
          }
        }
        @media (max-width: 480px) {
          .devices-text h2 {
            font-size: 22px !important;
          }
          .devices-image img {
            max-height: 280px;
          }
        }
      `}</style>
      <div className="devices-layout">
        <div className="devices-text">
          <h2 style={{ color: "#ffffff", fontSize: "34px", fontWeight: 700, margin: "0 0 6px", lineHeight: 1.2 }}>Quiz Question AI</h2>
          <h2 style={{ color: "#ffffff", fontSize: "34px", fontWeight: 700, margin: "0 0 24px", lineHeight: 1.2 }}>Is Available for All Devices</h2>
          <div className="devices-store-row" style={{ display: "flex", gap: "12px" }}>
            <a href="https://play.google.com/store/apps/details?id=com.quiz_question_ai" target="_blank" rel="noopener noreferrer">
              <img src="/images/google.svg" alt="Get it on Google Play" style={{ height: "44px", objectFit: "contain", borderRadius: "8px" }} />
            </a>
            <a href="https://apps.apple.com/us/app/quiz-question-al-study-pro/id6782490375" target="_blank" rel="noopener noreferrer">
              <img src="/images/apple.png" alt="Download on the App Store" style={{ height: "44px", objectFit: "contain", borderRadius: "8px" }} />
            </a>
          </div>
        </div>
        <div className="devices-image">
          <img src="/images/mockUp.png" alt="Quiz Question AI Mobile App" />
        </div>
      </div>
    </section>
  );
}
