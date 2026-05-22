"use client";
import { useState } from "react";
import { evaluate } from "mathjs";
import ModelSelector from "../_components/ModelSelector";
import { useMutation } from "@tanstack/react-query";
import { askChat, type ChatAskModel } from "@/app/(auth)/_lib/api";

// tabs removed per request

const buttons = [
  ["x", "y", "z", "x^2", "sqrt", "a/b", "mixed"],
  ["7", "8", "9", "+", "e", "ln", "sin"],
  ["4", "5", "6", "-", "pi", "log", "cos"],
  ["1", "2", "3", "×", "(", ")", "tan"],
  ["0", ".", "/", "←", "→", "del"],
];

const purpleKeys = ["+", "-", "×", "/"];

export default function CalculatorPage() {
  const [expression, setExpression] = useState("ax^2 + bx + c = 0");
  const [message, setMessage] = useState("");
  const [model, setModel] = useState<ChatAskModel>("gpt");
  const [response, setResponse] = useState("");

  const askMutation = useMutation({
    mutationFn: () => askChat(message, model),
    onSuccess: (data) => {
      setResponse(data.data.content || "");
    },
    onError: (err: Error) => {
      setResponse(err?.message || "Request failed.");
    },
  });

  const handleAsk = () => {
    if (!message.trim()) return;
    setResponse("");
    askMutation.mutate();
  };

  const handleKey = (key: string) => {
    if (key === "del") return setExpression("");
    if (key === "←") return setExpression((prev) => prev.slice(0, -1));
    if (key === "→") return;
    if (key === "sqrt") return setExpression((prev) => prev + "sqrt(");
    if (key === "x^2") return setExpression((prev) => prev + "^2");
    if (key === "pi") return setExpression((prev) => prev + "π");
    if (key === "×") return setExpression((prev) => prev + "*");
    setExpression((prev) => prev + key);
  };

  const handleSolve = () => {
    try {
      const cleaned = expression.replace(/×/g, "*").replace(/π/g, "pi");
      const result = evaluate(cleaned);
      setExpression(String(result));
    } catch {
      setExpression("Error");
    }
  };

  return (
    <div style={{ padding: "24px 32px", maxWidth: "900px", width: "100%" }}>
      {/* Dynamic Model Selector */}
      <div style={{ marginBottom: "16px" }}>
        <ModelSelector size="sm" value={model} onChange={setModel} />
      </div>

      {/* Chat Input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "#16161f",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "12px",
          padding: "12px 14px",
          marginBottom: "28px",
        }}
      >
        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.3)" strokeWidth={1.8}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
        </svg>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAsk();
            }
          }}
          placeholder="Type your question or upload an image..."
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            color: "#ffffff",
            fontSize: "13px",
          }}
        />
        <button
          onClick={handleAsk}
          disabled={askMutation.isPending}
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
            border: "none",
            cursor: askMutation.isPending ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>

      {response && (
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", margin: "-8px 0 20px" }}>
          {response}
        </p>
      )}

      {/* Calculator Card */}
      <div
        style={{
          backgroundColor: "#111118",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        

        <div style={{ padding: "20px" }}>
          {/* Expression Display */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#0f0f17",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "10px",
              padding: "16px 20px",
              marginBottom: "20px",
            }}
          >
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSolve();
                }
              }}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: 500,
                fontFamily: "monospace",
                letterSpacing: "1px",
                marginRight: "12px",
              }}
            />
            <button
              onClick={handleSolve}
              style={{
                background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
                border: "none",
                borderRadius: "20px",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                padding: "9px 24px",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Solve
            </button>
          </div>

          {/* Keypad */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {buttons.map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: "8px" }}>
                {row.map((key) => {
                  const isPurple = purpleKeys.includes(key);
                  const isFirstRowX = key === "x" && ri === 0;
                  return (
                    <button
                      key={`${ri}-${key}`}
                      onClick={() => handleKey(key)}
                      style={{
                        flex: 1,
                        padding: "14px 8px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: isPurple || isFirstRowX
                          ? "rgba(108,92,231,0.35)"
                          : "#1e1e2a",
                        color: isPurple || isFirstRowX
                          ? "#7b68ee"
                          : "rgba(255,255,255,0.85)",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.12s ease",
                        fontFamily: "monospace",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isPurple || isFirstRowX
                          ? "rgba(108,92,231,0.55)"
                          : "rgba(255,255,255,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isPurple || isFirstRowX
                          ? "rgba(108,92,231,0.35)"
                          : "#1e1e2a";
                      }}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
