"use client";

const plans = [
  {
    name: "Weekly",
    price: "$7.99",
    period: "/week",
    features: [
      { text: "Unlimited AI questions", included: true },
      { text: "All AI models (GPT-4o, Claude, Gemini)", included: true },
      { text: "Photo to Solution", included: true },
      { text: "Unlimited history", included: true },
      { text: "Priority support", included: true },
    ],
    buttonText: "Get Started",
    buttonStyle: "outline" as const,
  },
  {
    name: "Monthly",
    price: "$19.99",
    period: "/month",
    features: [
      { text: "Unlimited AI questions", included: true },
      { text: "All AI models (GPT-4o, Claude, Gemini)", included: true },
      { text: "Photo to Solution", included: true },
      { text: "Unlimited history", included: true },
      { text: "Priority support", included: true },
    ],
    buttonText: "Upgrade to Pro",
    buttonStyle: "filled" as const,
    popular: true,
  },
  {
    name: "Yearly",
    price: "$59.99",
    period: "/year",
    features: [
      { text: "Unlimited AI questions", included: true },
      { text: "All AI models (GPT-4o, Claude, Gemini)", included: true },
      { text: "Photo to Solution", included: true },
      { text: "Unlimited history", included: true },
      { text: "Priority support", included: true },
    ],
    buttonText: "Save Big",
    buttonStyle: "outline" as const,
  },
];

export default function PricingSection() {
  return (
    <section
      style={{
        padding: "80px 40px",
        textAlign: "center",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          color: "#ffffff",
          fontSize: "34px",
          fontWeight: 700,
          margin: "0 0 50px",
        }}
      >
        Choose Your Subscription Plan
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
        }}
      >
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={{
              backgroundColor: "#111118",
              borderRadius: "16px",
              border: plan.popular
                ? "1px solid rgba(79,70,229,0.4)"
                : "1px solid rgba(255,255,255,0.06)",
              padding: "36px 28px",
              textAlign: "left",
              position: "relative",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {plan.popular && (
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  right: "24px",
                  backgroundColor: "#4F46E5",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "4px 14px",
                  borderRadius: "20px",
                  letterSpacing: "0.3px",
                }}
              >
                Popular
              </div>
            )}

            <h3
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "15px",
                fontWeight: 600,
                margin: "0 0 6px",
              }}
            >
              {plan.name}
            </h3>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "4px",
                marginBottom: "28px",
              }}
            >
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "40px",
                  fontWeight: 700,
                }}
              >
                {plan.price}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "14px",
                }}
              >
                {plan.period}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                marginBottom: "32px",
              }}
            >
              {plan.features.map((f) => (
                <div
                  key={f.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>

                  <span
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontSize: "13px",
                    }}
                  >
                    {f.text}
                  </span>
                </div>
              ))}
            </div>

            <button
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                ...(plan.buttonStyle === "filled"
                  ? {
                      backgroundColor: "#4F46E5",
                      border: "none",
                      color: "#ffffff",
                    }
                  : {
                      backgroundColor: "transparent",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.8)",
                    }),
              }}
              onMouseEnter={(e) => {
                if (plan.buttonStyle === "filled") {
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(79,70,229,0.3)";
                } else {
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.3)";
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseLeave={(e) => {
                if (plan.buttonStyle === "filled") {
                  e.currentTarget.style.boxShadow = "none";
                } else {
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.15)";
                  e.currentTarget.style.color =
                    "rgba(255,255,255,0.8)";
                }
              }}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}