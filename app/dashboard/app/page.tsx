"use client";

export default function AppPage() {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <style>{`
        .app-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }
        .app-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 60px;
          position: relative;
          overflow: hidden;
          padding: 40px;
          width: 100%;
          max-width: 1000px;
        }
        .app-left-content {
          flex: 1;
          max-width: 460px;
          position: relative;
          z-index: 1;
        }
        .app-right-content {
          position: relative;
          width: 380px;
          height: 420px;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .store-buttons-container {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        @media (max-width: 860px) {
          .app-container {
            padding: 20px 10px;
          }
          .app-section {
            flex-direction: column;
            gap: 40px;
            padding: 20px;
            text-align: center;
          }
          .app-left-content {
            max-width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .app-left-content h1 {
            font-size: 28px !important;
            margin-bottom: 20px !important;
          }
          .store-buttons-container {
            justify-content: center;
          }
        }
        @media (max-width: 480px) {
          .app-left-content h1 {
            font-size: 24px !important;
          }
          .app-right-content {
            transform: scale(0.8);
            margin: -30px 0;
          }
        }
        @media (max-width: 380px) {
          .app-right-content {
            transform: scale(0.7);
            margin: -50px 0;
          }
        }
      `}</style>

      {/* Content wrapper to center things */}
      <div className="app-container">
        {/* Hero Section Container */}
        <section className="app-section">
          {/* Purple gradient overlay */}
          <div
            style={{
              position: "absolute",
              right: "-100px",
              top: "-100px",
              width: "400px",
              height: "400px",
              background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Left Content */}
          <div className="app-left-content">
            <p
              style={{
                color: "#7b68ee",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "1px",
                margin: "0 0 10px",
                textTransform: "uppercase",
              }}
            >
              Download Now!!
            </p>
            <h1
              style={{
                color: "#ffffff",
                fontSize: "36px",
                fontWeight: 700,
                lineHeight: 1.25,
                margin: "0 0 28px",
              }}
            >
              Quiz Question AI
              <br />
              Is Available for All Devices
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "1px",
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              DOWNLOAD APP
            </p>

            <div className="store-buttons-container">
              {/* Google Play */}
              <a
                href="https://play.google.com/store/apps/details?id=com.quiz_question_ai"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 16px",
                  backgroundColor: "#111118",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(79,70,229,0.5)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5Z" fill="#4285F4" />
                  <path d="M16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12Z" fill="#EA4335" />
                  <path d="M21 12C21 12.68 20.58 13.28 19.94 13.54L17.46 14.78L14.97 12.29L14.54 12L17.03 9.51L19.94 10.98C20.58 11.23 21 11.83 21 12Z" fill="#FBBC04" />
                  <path d="M6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" fill="#34A853" />
                </svg>
                <div style={{ textAlign: "left" }}>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "8px", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>GET IT ON</p>
                  <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 600, margin: 0 }}>Google Play</p>
                </div>
              </a>

              {/* App Store */}
              <a
                href="https://apps.apple.com/us/app/quiz-question-al-study-pro/id6782490375"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 16px",
                  backgroundColor: "#111118",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(79,70,229,0.5)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >
                <svg width="18" height="20" viewBox="0 0 18 22" fill="#ffffff">
                  <path d="M14.94 11.5c-.03-2.79 2.27-4.13 2.38-4.2-1.3-1.9-3.32-2.16-4.04-2.19-1.72-.17-3.36 1.01-4.23 1.01-.87 0-2.22-.99-3.65-.96-1.88.03-3.61 1.09-4.58 2.78-1.95 3.39-.5 8.41 1.4 11.16.93 1.34 2.04 2.86 3.5 2.8 1.4-.06 1.93-.91 3.63-.91 1.69 0 2.18.91 3.66.88 1.51-.03 2.48-1.37 3.4-2.72 1.07-1.56 1.51-3.07 1.54-3.15-.03-.01-2.95-1.13-2.98-4.5h-.03z" />
                  <path d="M12.17 3.54c.77-.94 1.29-2.24 1.15-3.54-1.11.04-2.45.74-3.25 1.67-.71.83-1.34 2.15-1.17 3.42 1.24.1 2.5-.63 3.27-1.55z" />
                </svg>
                <div style={{ textAlign: "left" }}>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "8px", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Download on the</p>
                  <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 600, margin: 0 }}>App Store</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Phone Mockups */}
          <div className="app-right-content">
            {/* Main phone */}
            <div
              style={{
                position: "absolute",
                left: "20px",
                top: "0",
                width: "210px",
                height: "400px",
                borderRadius: "24px",
                border: "3px solid rgba(255,255,255,0.15)",
                backgroundColor: "#0A0A0F",
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                zIndex: 2,
              }}
            >
              {/* Status bar */}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 16px", fontSize: "10px", color: "#fff" }}>
                <span>9:41</span>
                <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>
              {/* Phone content */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 16px", height: "calc(100% - 50px)" }}>
                <img src="/images/ai-logo.png" alt="Quiz Question AI" style={{ height: "42px", marginBottom: "10px", objectFit: "contain" }} />
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", textAlign: "center", margin: 0 }}>Quiz Question AI</p>
              </div>
              {/* Home indicator */}
              <div style={{ position: "absolute", bottom: "6px", left: "50%", transform: "translateX(-50%)", width: "70px", height: "3px", borderRadius: "2px", backgroundColor: "rgba(255,255,255,0.3)" }} />
            </div>

            {/* Second phone (behind, offset) */}
            <div
              style={{
                position: "absolute",
                right: "10px",
                top: "30px",
                width: "190px",
                height: "360px",
                borderRadius: "24px",
                border: "3px solid rgba(255,255,255,0.08)",
                backgroundColor: "#0A0A0F",
                overflow: "hidden",
                boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
                zIndex: 1,
              }}
            >
              {/* Status bar */}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 14px", fontSize: "9px", color: "#fff" }}>
                <span>9:41</span>
                <span>📶</span>
              </div>
              {/* Phone content - app preview */}
              <div style={{ padding: "12px", height: "calc(100% - 25px)", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                  <img src="/images/ai-logo.png" alt="" style={{ height: "16px" }} />
                  <span style={{ color: "#fff", fontSize: "9px", fontWeight: 600 }}>Quiz Question AI</span>
                </div>
                {/* Decorative AI image */}
                <div style={{ flex: 1, borderRadius: "10px", overflow: "hidden", background: "linear-gradient(180deg, #1a1a2e 0%, #7b68ee30 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "30px", marginBottom: "4px" }}>🧠</div>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "8px", margin: 0 }}>AI-Powered Learning</p>
                  </div>
                </div>
                {/* Onboarding text */}
                <div style={{ marginTop: "10px" }}>
                  <p style={{ color: "#fff", fontSize: "10px", fontWeight: 600, margin: "0 0 2px" }}>AI-Powered Learning</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "8px", margin: "0 0 6px", lineHeight: 1.3 }}>Your academic companion powered by models.</p>
                  <div style={{ padding: "5px", backgroundColor: "#7b68ee", borderRadius: "5px", textAlign: "center" }}>
                    <span style={{ color: "#fff", fontSize: "8px", fontWeight: 600 }}>Next 1/3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
