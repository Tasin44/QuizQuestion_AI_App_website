"use client";

export default function DevicesSection() {
  return (
    <section
      style={{
        padding: "80px 40px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "60px",
        }}
      >
        {/* Left - Text Content */}
        <div style={{ flex: 1 }}>
          <h2 style={{ color: "#ffffff", fontSize: "34px", fontWeight: 700, margin: "0 0 6px", lineHeight: 1.2 }}>
            Quiz Question AI
          </h2>
          <h2 style={{ color: "#ffffff", fontSize: "34px", fontWeight: 700, margin: "0 0 24px", lineHeight: 1.2 }}>
            Is Available for All Devices
          </h2>

          {/* App Store Badges */}
          <div style={{ display: "flex", gap: "12px" }}>
            <a href="https://play.google.com/store/apps/details?id=com.quiz_question_ai" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/google.svg"
                alt="Get it on Google Play"
                style={{ height: "44px", objectFit: "contain", borderRadius: "8px" }}
              />
            </a>
            <a href="https://apps.apple.com/us/app/quiz-question-al-study-pro/id6782490375" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/apple.png"
                alt="Download on the App Store"
                style={{ height: "44px", objectFit: "contain", borderRadius: "8px" }}
              />
            </a>
          </div>
        </div>

        {/* Right - Phone Mockup */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <img
            src="/images/mockUp.png"
            alt="Quiz Question AI Mobile App"
            style={{
              maxHeight: "500px",
              objectFit: "contain",
              filter: "drop-shadow(0 20px 60px rgba(79,70,229,0.15))",
            }}
          />
        </div>
      </div>
    </section>
  );
}
