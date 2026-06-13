"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { evaluate } from "mathjs";
import ModelSelector from "../_components/ModelSelector";
import { useMutation } from "@tanstack/react-query";
import { askChat, type ChatAskModel } from "@/app/(auth)/_lib/api";
import { Calculator, Sparkles } from "lucide-react";

const buttons = [
  ["x", "y", "z", "x^2", "sqrt", "a/b", "del"],
  ["7", "8", "9", "+", "e", "ln", "sin"],
  ["4", "5", "6", "-", "pi", "log", "cos"],
  ["1", "2", "3", "×", "(", ")", "tan"],
  ["0", ".", "/", "←", "="],
];

const purpleKeys = ["+", "-", "×", "/"];

function renderInlineMarkdown(text: string) {
  if (!text) return "";
  const codeParts = text.split(/(`[^`]+`)/g);
  return codeParts.map((part, partIdx) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={partIdx} style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", fontFamily: "monospace", color: "#ef4444" }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    const starParts = part.split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/g);
    return starParts.map((sub, subIdx) => {
      if (sub.startsWith("***") && sub.endsWith("***")) return <strong key={subIdx} style={{ fontWeight: 700, fontStyle: "italic", color: "#fff" }}>{sub.slice(3, -3)}</strong>;
      if (sub.startsWith("**") && sub.endsWith("**")) return <strong key={subIdx} style={{ fontWeight: 700, color: "#fff" }}>{sub.slice(2, -2)}</strong>;
      if (sub.startsWith("*") && sub.endsWith("*")) return <em key={subIdx} style={{ fontStyle: "italic" }}>{sub.slice(1, -1)}</em>;
      return sub;
    });
  });
}

function renderMessageContent(content: string) {
  if (!content) return null;
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const code = match ? match[2] : part.slice(3, -3);
      return (
        <pre key={index} style={{ backgroundColor: "rgba(0,0,0,0.25)", padding: "12px", borderRadius: "8px", fontFamily: "monospace", fontSize: "13px", overflowX: "auto", margin: "8px 0", border: "1px solid rgba(255,255,255,0.05)", color: "#e2e8f0" }}>
          <code style={{ color: "inherit", background: "none", padding: 0 }}>{code.trim()}</code>
        </pre>
      );
    }
    const lines = part.split("\n");
    return (
      <div key={index}>
        {lines.map((line, lineIdx) => {
          const bulletMatch = line.match(/^(\s*)[-*+•]\s+(.*)/);
          if (bulletMatch) {
            const indent = bulletMatch[1].length * 12;
            return <div key={lineIdx} style={{ display: "flex", gap: "6px", paddingLeft: `${indent + 8}px`, margin: "4px 0", color: "inherit" }}><span>•</span><span>{renderInlineMarkdown(bulletMatch[2])}</span></div>;
          }
          const numberMatch = line.match(/^(\s*)\d+\.\s+(.*)/);
          if (numberMatch) {
            const indent = numberMatch[1].length * 12;
            const num = line.match(/^\s*(\d+)\./)?.[1] || "1";
            return <div key={lineIdx} style={{ display: "flex", gap: "6px", paddingLeft: `${indent + 8}px`, margin: "4px 0", color: "inherit" }}><span>{num}.</span><span>{renderInlineMarkdown(numberMatch[2])}</span></div>;
          }
          if (line.startsWith("### ")) return <h4 key={lineIdx} style={{ fontSize: "15px", fontWeight: 700, margin: "12px 0 6px", color: "#fff" }}>{renderInlineMarkdown(line.slice(4))}</h4>;
          if (line.startsWith("## ")) return <h3 key={lineIdx} style={{ fontSize: "17px", fontWeight: 700, margin: "16px 0 8px", color: "#fff" }}>{renderInlineMarkdown(line.slice(3))}</h3>;
          if (line.startsWith("# ")) return <h2 key={lineIdx} style={{ fontSize: "19px", fontWeight: 700, margin: "20px 0 10px", color: "#fff" }}>{renderInlineMarkdown(line.slice(2))}</h2>;
          return <p key={lineIdx} style={{ margin: line.trim() === "" ? "8px 0" : "4px 0", minHeight: line.trim() === "" ? "8px" : "auto", lineHeight: "1.6", color: "inherit" }}>{renderInlineMarkdown(line)}</p>;
        })}
      </div>
    );
  });
}

export default function CalculatorPage() {
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState<Array<{ expr: string; result: string }>>([]);
  const [model, setModel] = useState("auto");
  const [response, setResponse] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        const savedModel = localStorage.getItem("preferred_model");
        if (savedModel) setModel(savedModel);
        const savedHistory = localStorage.getItem("calc_history");
        if (savedHistory) {
          try { setHistory(JSON.parse(savedHistory)); } catch { /* ignore */ }
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // Live preview - computed inline, no state needed
  let livePreview = "";
  try {
    if (expression.trim()) {
      const cleaned = expression.replace(/×/g, "*").replace(/π/g, "pi");
      livePreview = String(evaluate(cleaned));
    }
  } catch { /* not evaluable yet */ }

  const askMutation = useMutation({
    mutationFn: () => {
      let apiModel: ChatAskModel = "gpt";
      if (model === "gemini-pro" || model === "gemini") apiModel = "gemini";
      else if (model.startsWith("claude") || model === "claude") apiModel = "claude";
      return askChat(`Solve and explain this math problem step-by-step in a clear, educational way: ${expression}`, apiModel);
    },
    onSuccess: (data) => setResponse(data.data.content || ""),
    onError: (err: Error) => setResponse(err?.message || "Request failed."),
  });

  const handleSolve = () => {
    if (!expression.trim()) return;
    try {
      const cleaned = expression.replace(/×/g, "*").replace(/π/g, "pi");
      const result = evaluate(cleaned);
      const resultStr = String(result);
      setHistory((prev) => {
        const updated = [{ expr: expression, result: resultStr }, ...prev].slice(0, 20);
        if (typeof window !== "undefined") localStorage.setItem("calc_history", JSON.stringify(updated));
        return updated;
      });
      setExpression(resultStr);
    } catch { setExpression("Error"); }
  };

  const handleKey = (key: string) => {
    if (key === "del") return setExpression("");
    if (key === "←") return setExpression((prev) => prev.slice(0, -1));
    if (key === "=") return handleSolve();
    if (key === "sqrt") return setExpression((prev) => prev + "sqrt(");
    if (key === "x^2") return setExpression((prev) => prev + "^2");
    if (key === "pi") return setExpression((prev) => prev + "π");
    if (key === "×") return setExpression((prev) => prev + "*");
    setExpression((prev) => prev + key);
  };

  const handleAskAI = () => {
    if (!expression.trim()) return;
    setResponse("");
    askMutation.mutate();
  };

  const handleCopy = () => {
    if (livePreview) {
      navigator.clipboard.writeText(livePreview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    if (typeof window !== "undefined") localStorage.removeItem("calc_history");
  };

  return (
    <div className="calc-page">
      <style>{`
        .calc-page { display: flex; flex-direction: column; align-items: center; padding: 28px; width: 100%; max-width: 900px; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .calc-page { padding: 14px; }
          .calc-btn { padding: 18px 6px !important; font-size: 16px !important; }
        }
      `}</style>

      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px", fontWeight: 500, transition: "all 0.2s ease" }}>
          <span aria-hidden="true">←</span><span>Back to Chat</span>
        </Link>
      </div>

      {/* Calculator Card */}
      <div style={{ width: "100%", backgroundColor: "#111118", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)", overflow: "visible", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
        <div style={{ padding: "28px" }}>
          <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 600, margin: "0 0 24px", display: "flex", alignItems: "center", gap: "10px" }}><Calculator size={20} style={{ color: "#7b68ee" }} /> Math Calculator</h2>

          {/* Expression Display */}
          <div style={{ display: "flex", alignItems: "center", backgroundColor: "#0f0f17", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "18px 22px", marginBottom: "8px" }}>
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSolve(); } }}
              placeholder="Enter equation or expression..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "24px", fontWeight: 500, fontFamily: "monospace", letterSpacing: "1px", marginRight: "14px" }}
            />
            <button onClick={handleSolve} style={{ background: "linear-gradient(135deg, #6c5ce7, #7b68ee)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "22px", fontWeight: 700, padding: "10px 24px", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}>=</button>
          </div>

          {/* Live Preview */}
          {livePreview && expression !== livePreview && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 20px", marginBottom: "12px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "16px", color: "rgba(123,104,238,0.85)" }}>= {livePreview}</span>
              <button onClick={handleCopy} style={{ background: "none", border: "none", color: copied ? "#22c55e" : "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "12px", padding: "4px 8px", borderRadius: "6px", transition: "all 0.2s" }}>
                {copied ? "✓ Copied" : "📋 Copy"}
              </button>
            </div>
          )}
          {(!livePreview || expression === livePreview) && <div style={{ height: "12px" }} />}

          {/* Keypad */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {buttons.map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: "10px" }}>
                {row.map((key) => {
                  const isPurple = purpleKeys.includes(key);
                  const isFirstRowX = key === "x" && ri === 0;
                  const isEquals = key === "=";
                  const isDel = key === "del";

                  let bg = "#1e1e2a";
                  let fg = "rgba(255,255,255,0.85)";
                  let hoverBg = "rgba(255,255,255,0.1)";
                  if (isEquals) { bg = ""; fg = "#fff"; hoverBg = ""; }
                  else if (isDel) { bg = "rgba(239,68,68,0.15)"; fg = "#ef4444"; hoverBg = "rgba(239,68,68,0.25)"; }
                  else if (isPurple || isFirstRowX) { bg = "rgba(108,92,231,0.35)"; fg = "#7b68ee"; hoverBg = "rgba(108,92,231,0.55)"; }

                  return (
                    <button
                      key={`${ri}-${key}`}
                      className="calc-btn"
                      onClick={() => handleKey(key)}
                      style={{
                        flex: isEquals ? 2 : 1,
                        padding: "18px 10px",
                        borderRadius: "8px",
                        border: "none",
                        ...(isEquals ? { background: "linear-gradient(135deg, #6c5ce7, #7b68ee)" } : { backgroundColor: bg }),
                        color: fg,
                        fontSize: isEquals ? "18px" : "16px",
                        fontWeight: isEquals ? 700 : 500,
                        cursor: "pointer",
                        transition: "all 0.12s ease",
                        fontFamily: "monospace",
                      }}
                      onMouseEnter={(e) => { if (!isEquals) e.currentTarget.style.backgroundColor = hoverBg; }}
                      onMouseLeave={(e) => { if (!isEquals) e.currentTarget.style.backgroundColor = bg; }}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* AI Explain + Model Selector */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", gap: "12px" }}>
            <button
              onClick={handleAskAI}
              disabled={askMutation.isPending || !expression.trim()}
              style={{
                flex: 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                height: "46px",
                padding: "0 20px",
                borderRadius: "10px",
                border: "1px solid rgba(123,104,238,0.3)",
                backgroundColor: "rgba(123,104,238,0.08)",
                color: "#7b68ee",
                fontSize: "14px",
                fontWeight: 600,
                cursor: expression.trim() ? "pointer" : "default",
                opacity: expression.trim() ? 1 : 0.4,
                transition: "all 0.2s",
                boxSizing: "border-box",
              }}
            >
              {askMutation.isPending ? (
                <><div style={{ width: "14px", height: "14px", border: "2px solid rgba(123,104,238,0.3)", borderTopColor: "#7b68ee", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Explaining...</>
              ) : <><Sparkles size={16} /> Explain with AI</>}
            </button>
            <ModelSelector
              size="sm"
              value={model}
              onChange={(val) => { setModel(val); if (typeof window !== "undefined") localStorage.setItem("preferred_model", val); }}
              direction="up"
              height="46px"
              borderRadius="10px"
            />
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      {(askMutation.isPending || response) && (
        <div style={{ width: "100%", marginTop: "16px", backgroundColor: "#111118", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)", padding: "20px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>🤖 AI Explanation</h3>
            {response && <button onClick={() => setResponse("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "18px", padding: "0 4px" }}>×</button>}
          </div>
          {askMutation.isPending ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "28px 0", color: "rgba(255,255,255,0.4)" }}>
              <div style={{ width: "32px", height: "32px", border: "3px solid rgba(123,104,238,0.15)", borderTopColor: "#7b68ee", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: "13px" }}>AI is solving...</span>
            </div>
          ) : (
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", lineHeight: 1.65, maxHeight: "400px", overflowY: "auto", padding: "12px 16px", borderRadius: "10px", backgroundColor: "#0f0f17", border: "1px solid rgba(255,255,255,0.05)" }}>
              {renderMessageContent(response)}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div style={{ width: "100%", marginTop: "16px", backgroundColor: "#111118", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)", padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>📜 History</h3>
            <button onClick={clearHistory} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "12px", padding: "4px 8px", transition: "all 0.2s" }}>Clear</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {history.map((item, i) => (
              <div
                key={i}
                onClick={() => setExpression(item.expr)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "8px", backgroundColor: "#0f0f17", border: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(123,104,238,0.2)"; e.currentTarget.style.backgroundColor = "#13131d"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)"; e.currentTarget.style.backgroundColor = "#0f0f17"; }}
              >
                <span style={{ fontFamily: "monospace", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{item.expr}</span>
                <span style={{ fontFamily: "monospace", fontSize: "13px", color: "#7b68ee", fontWeight: 600 }}>= {item.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
