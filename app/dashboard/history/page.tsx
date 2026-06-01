"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getChatHistory } from "@/app/(auth)/_lib/api";

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getTagDetails(prompt: string) {
  const p = prompt.toLowerCase();
  if (p.includes("math") || p.includes("+") || p.includes("-") || p.includes("*") || p.includes("/") || p.includes("solve") || p.includes("equation")) {
    return { tag: "Math", color: "#ef4444" };
  }
  if (p.includes("physic") || p.includes("force") || p.includes("energy") || p.includes("gravity")) {
    return { tag: "Physics", color: "#22c55e" };
  }
  if (p.includes("chem") || p.includes("atom") || p.includes("reaction") || p.includes("molecule")) {
    return { tag: "Chemistry", color: "#eab308" };
  }
  if (p.includes("bio") || p.includes("cell") || p.includes("plant") || p.includes("gene")) {
    return { tag: "Biology", color: "#38bdf8" };
  }
  return { tag: "General", color: "#8b5cf6" };
}

export default function HistoryPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["chatHistory"],
    queryFn: getChatHistory,
  });

  const historyItems = data?.data || [];

  return (
    <div style={{ padding: "32px clamp(16px, 4vw, 40px)", maxWidth: "800px", margin: "0" }}>
      {/* Header */}
      <h1 style={{ color: "#ffffff", fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 700, margin: "0 0 28px" }}>
        Chat History
      </h1>

      {isLoading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <div
            style={{
              width: "24px",
              height: "24px",
              border: "2px solid rgba(255,255,255,0.2)",
              borderTopColor: "#4F46E5",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
        </div>
      )}

      {error && (
        <p style={{ color: "#ef4444", fontSize: "14px", textAlign: "center" }}>
          Failed to load chat history. Please make sure you are logged in.
        </p>
      )}

      {!isLoading && !error && historyItems.length === 0 && (
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", textAlign: "center", marginTop: "40px" }}>
          No chat history found. Start a new session on the dashboard!
        </p>
      )}

      {/* History Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {historyItems.map((item) => {
          const { tag, color } = getTagDetails(item.prompt);
          return (
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
                      backgroundColor: `${color}20`,
                      color: color,
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </span>
                  {/* Date */}
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>
                    {formatDate(item.created_at)}
                  </span>
                </div>

                <h3 style={{ color: "#ffffff", fontSize: "15px", fontWeight: 600, margin: "0 0 8px", lineHeight: 1.4 }}>
                  {item.prompt}
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "13px",
                    margin: 0,
                    lineHeight: 1.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.ai_response}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
