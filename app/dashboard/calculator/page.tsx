"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { evaluate } from "mathjs";
import ModelSelector from "../_components/ModelSelector";
import { useMutation } from "@tanstack/react-query";
import { askChat, askChatFormData, type ChatAskModel } from "@/app/(auth)/_lib/api";

// tabs removed per request

const buttons = [
  ["x", "y", "z", "x^2", "sqrt", "a/b", "mixed"],
  ["7", "8", "9", "+", "e", "ln", "sin"],
  ["4", "5", "6", "-", "pi", "log", "cos"],
  ["1", "2", "3", "×", "(", ")", "tan"],
  ["0", ".", "/", "←", "→", "del"],
];

const purpleKeys = ["+", "-", "×", "/"];

// Render inline elements like bold (**), triple stars (***), or backticks (`)
function renderInlineMarkdown(text: string) {
  if (!text) return "";

  const codeParts = text.split(/(`[^`]+`)/g);
  
  return codeParts.map((part, partIdx) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={partIdx}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "12px",
            fontFamily: "monospace",
            color: "#ef4444",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const starParts = part.split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/g);
    
    return starParts.map((subPart, subIdx) => {
      if (subPart.startsWith("***") && subPart.endsWith("***")) {
        return (
          <strong key={subIdx} style={{ fontWeight: 700, fontStyle: "italic", color: "#ffffff" }}>
            {subPart.slice(3, -3)}
          </strong>
        );
      }
      if (subPart.startsWith("**") && subPart.endsWith("**")) {
        return (
          <strong key={subIdx} style={{ fontWeight: 700, color: "#ffffff" }}>
            {subPart.slice(2, -2)}
          </strong>
        );
      }
      if (subPart.startsWith("*") && subPart.endsWith("*")) {
        return (
          <em key={subIdx} style={{ fontStyle: "italic" }}>
            {subPart.slice(1, -1)}
          </em>
        );
      }
      return subPart;
    });
  });
}

// Render block markdown like lists, code blocks, and headers cleanly
function renderMessageContent(content: string) {
  if (!content) return null;

  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const code = match ? match[2] : part.slice(3, -3);

      return (
        <pre
          key={index}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            padding: "12px",
            borderRadius: "8px",
            fontFamily: "monospace",
            fontSize: "13px",
            overflowX: "auto",
            margin: "8px 0",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            color: "#e2e8f0",
          }}
        >
          <code style={{ color: "inherit", background: "none", padding: 0 }}>{code.trim()}</code>
        </pre>
      );
    }

    const lines = part.split("\n");
    return (
      <div key={index}>
        {lines.map((line, lineIdx) => {
          const cleanLine = line;

          const bulletMatch = cleanLine.match(/^(\s*)[-*+•]\s+(.*)/);
          if (bulletMatch) {
            const indent = bulletMatch[1].length * 12;
            return (
              <div
                key={lineIdx}
                style={{
                  display: "flex",
                  gap: "6px",
                  paddingLeft: `${indent + 8}px`,
                  margin: "4px 0",
                  color: "inherit",
                }}
              >
                <span>•</span>
                <span>{renderInlineMarkdown(bulletMatch[2])}</span>
              </div>
            );
          }

          const numberMatch = cleanLine.match(/^(\s*)\d+\.\s+(.*)/);
          if (numberMatch) {
            const indent = numberMatch[1].length * 12;
            const num = cleanLine.match(/^\s*(\d+)\./)?.[1] || "1";
            return (
              <div
                key={lineIdx}
                style={{
                  display: "flex",
                  gap: "6px",
                  paddingLeft: `${indent + 8}px`,
                  margin: "4px 0",
                  color: "inherit",
                }}
              >
                <span>{num}.</span>
                <span>{renderInlineMarkdown(numberMatch[2])}</span>
              </div>
            );
          }

          if (cleanLine.startsWith("### ")) {
            return (
              <h4 key={lineIdx} style={{ fontSize: "15px", fontWeight: 700, margin: "12px 0 6px", color: "#fff" }}>
                {renderInlineMarkdown(cleanLine.slice(4))}
              </h4>
            );
          }
          if (cleanLine.startsWith("## ")) {
            return (
              <h3 key={lineIdx} style={{ fontSize: "17px", fontWeight: 700, margin: "16px 0 8px", color: "#fff" }}>
                {renderInlineMarkdown(cleanLine.slice(3))}
              </h3>
            );
          }
          if (cleanLine.startsWith("# ")) {
            return (
              <h2 key={lineIdx} style={{ fontSize: "19px", fontWeight: 700, margin: "20px 0 10px", color: "#fff" }}>
                {renderInlineMarkdown(cleanLine.slice(2))}
              </h2>
            );
          }

          return (
            <p
              key={lineIdx}
              style={{
                margin: cleanLine.trim() === "" ? "8px 0" : "4px 0",
                minHeight: cleanLine.trim() === "" ? "8px" : "auto",
                lineHeight: "1.6",
                color: "inherit",
              }}
            >
              {renderInlineMarkdown(cleanLine)}
            </p>
          );
        })}
      </div>
    );
  });
}

export default function CalculatorPage() {
  const [expression, setExpression] = useState("ax^2 + bx + c = 0");
  const [message, setMessage] = useState("");
  const [model, setModel] = useState<ChatAskModel>("gpt");
  const [response, setResponse] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const askMutation = useMutation({
    mutationFn: () => {
      if (imageFile || docFile) {
        return askChatFormData({ message, model, image: imageFile || undefined, file: docFile || undefined });
      }
      return askChat(message, model);
    },
    onSuccess: (data) => {
      setResponse(data.data.content || "");
      setImageFile(null);
      setDocFile(null);
    },
    onError: (err: Error) => {
      setResponse(err?.message || "Request failed.");
    },
  });

  const handleAsk = () => {
    if (!message.trim() && !imageFile && !docFile) return;
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
    <div style={{ padding: "24px 32px", maxWidth: "1200px", width: "100%", margin: "0" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.8)",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: 500,
            transition: "all 0.2s ease",
          }}
        >
          <span aria-hidden="true">←</span>
          <span>Back to Chat</span>
        </Link>
      </div>

      {/* 2-Column side-by-side Flex layout */}
      <div style={{ display: "flex", gap: "28px", alignItems: "flex-start", width: "100%", flexWrap: "wrap" }}>
        
        {/* Left Column: Calculator Card */}
        <div style={{ flex: "1 1 450px", minWidth: "320px" }}>
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

        {/* Right Column: Chat Assistant (moved to the right) */}
        <div style={{ flex: "1 1 400px", minWidth: "320px" }}>
          {/* Attachment previews */}
          {(imageFile || docFile) && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "6px 10px 4px", marginBottom: "8px" }}>
              {imageFile && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(79,70,229,0.12)",
                    border: "1px solid rgba(79,70,229,0.2)",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  🖼️ {imageFile.name.length > 25 ? imageFile.name.slice(0, 22) + "…" : imageFile.name}
                  <button
                    onClick={() => setImageFile(null)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.4)",
                      cursor: "pointer",
                      fontSize: "14px",
                      padding: "0 2px",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              )}
              {docFile && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  📎 {docFile.name.length > 25 ? docFile.name.slice(0, 22) + "…" : docFile.name}
                  <button
                    onClick={() => setDocFile(null)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.4)",
                      cursor: "pointer",
                      fontSize: "14px",
                      padding: "0 2px",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Chat Input Container */}
          <div
            className="chat-input-area"
            style={{
              width: "100%",
              backgroundColor: "#16161f",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "16px",
              padding: "8px",
              marginBottom: "20px",
              transition: "border-color 0.2s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", padding: "4px 6px" }}>
              {/* Image upload */}
              <button
                className="attach-btn"
                onClick={() => imageInputRef.current?.click()}
                title="Attach image"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.45)" strokeWidth={1.8}>
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
                </svg>
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setImageFile(f);
                  e.target.value = "";
                }}
              />

              {/* File upload */}
              <button
                className="attach-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Attach file"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.45)" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setDocFile(f);
                  e.target.value = "";
                }}
              />

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAsk();
                  }
                }}
                placeholder="Type your question or upload an image..."
                rows={1}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "#ffffff",
                  fontSize: "14px",
                  resize: "none",
                  lineHeight: "1.5",
                  padding: "7px 4px",
                  maxHeight: "120px",
                  fontFamily: "inherit",
                }}
              />

              {/* Model Selector inside input field on the right side */}
              <div style={{ flexShrink: 0, alignSelf: "flex-end", paddingBottom: "1px" }}>
                <ModelSelector size="sm" value={model} onChange={setModel} direction="down" />
              </div>

              {/* Send button (animates and displays only when input is typed or file uploaded) */}
              <div
                style={{
                  width: (message.trim() || imageFile || docFile || askMutation.isPending) ? "36px" : "0px",
                  marginLeft: (message.trim() || imageFile || docFile || askMutation.isPending) ? "4px" : "0px",
                  height: "36px",
                  overflow: "hidden",
                  opacity: (message.trim() || imageFile || docFile || askMutation.isPending) ? 1 : 0,
                  transform: (message.trim() || imageFile || docFile || askMutation.isPending) ? "scale(1)" : "scale(0.8)",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <button
                  className="send-btn"
                  onClick={handleAsk}
                  disabled={askMutation.isPending}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {askMutation.isPending ? (
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {response && (
            <div
              style={{
                padding: "16px 20px",
                borderRadius: "12px",
                backgroundColor: "#1a1a28",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.85)",
                fontSize: "14px",
                lineHeight: 1.65,
                marginBottom: "28px",
              }}
            >
              {renderMessageContent(response)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
