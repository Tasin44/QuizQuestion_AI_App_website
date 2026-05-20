"use client";
import Link from "next/link";

const chatHistory = [
  {
    id: "chat-1",
    tag: "Math",
    tagColor: "#ef4444",
    title: "Solve for x in the equation 3x + 7 = 22",
    desc: "From y = ln(4-x), we get 4-x = eʸ, therefore x = 4 - eʸ",
    date: "15 May 2026",
  },
  {
    id: "chat-2",
    tag: "Math",
    tagColor: "#ef4444",
    title: "Solve for x in the equation 3x + 7 = 22",
    desc: "From y = ln(4-x), we get 4-x = eʸ, therefore x = 4 - eʸ",
    date: "15 May 2026",
  },
  {
    id: "chat-3",
    tag: "Physics",
    tagColor: "#22c55e",
    title: "Calculate kinetic energy of a moving object",
    desc: "KE = ½mv². For m = 5kg and v = 10m/s, KE = 250 J",
    date: "14 May 2026",
  },
  {
    id: "chat-4",
    tag: "Chemistry",
    tagColor: "#eab308",
    title: "Balance the equation: Fe + O₂ → Fe₂O₃",
    desc: "4Fe + 3O₂ → 2Fe₂O₃. Count atoms on each side to verify.",
    date: "14 May 2026",
  },
  {
    id: "chat-5",
    tag: "Math",
    tagColor: "#ef4444",
    title: "Solve for x in the equation 3x + 7 = 22",
    desc: "From y = ln(4-x), we get 4-x = eʸ, therefore x = 4 - eʸ",
    date: "13 May 2026",
  },
];

export default function HistoryPage() {
  return (
    <div style={{ padding: "32px 40px", maxWidth: "700px" }}>
      {/* Logo */}
      <div style={{ marginBottom: "8px" }}>
        <img
          src="/images/ai-logo.png"
          alt="Quiz Question AI"
          style={{ height: "38px", objectFit: "contain" }}
        />
      </div>

      <h1 style={{ color: "#ffffff", fontSize: "26px", fontWeight: 700, margin: "0 0 28px" }}>
        Chat History
      </h1>

      {/* History Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {chatHistory.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/history/${item.id}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                backgroundColor: "#111118",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "22px 24px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(79,70,229,0.3)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                {/* Tag */}
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 12px",
                    borderRadius: "14px",
                    backgroundColor: `${item.tagColor}20`,
                    color: item.tagColor,
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {item.tag}
                </span>
                {/* Date */}
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>
                  {item.date}
                </span>
              </div>

              <h3 style={{ color: "#ffffff", fontSize: "15px", fontWeight: 600, margin: "0 0 6px" }}>
                {item.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
