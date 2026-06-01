"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import CompanionSection from "./_components/sections/CompanionSection";
import AIModelSection from "./_components/sections/AIModelSection";
import SubjectsSection from "./_components/sections/SubjectsSection";
import RevolutionSection from "./_components/sections/RevolutionSection";
import PricingSection from "./_components/sections/PricingSection";
import DevicesSection from "./_components/sections/DevicesSection";
import ModelSelector from "./_components/ModelSelector";
import { useMutation } from "@tanstack/react-query";
import { askChatFormData, type ChatAskModel } from "@/app/(auth)/_lib/api";
import { Bot, User } from "lucide-react";

/* ───── Types ───── */
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  model: string;
  timestamp: Date;
  attachments?: { name: string; type: "image" | "file" }[];
}

/* ───── Model label map ───── */
const MODEL_LABELS: Record<string, string> = {
  gpt: "GPT",
  claude: "Claude",
  gemini: "Gemini",
};

/* ───── Subject pills ───── */
const subjectPills = ["Math", "Physics", "Chemistry", "Biology", "Statistics"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: "4px", padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.4)",
            animation: `typingBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

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

export default function DashboardPage() {
  const [message, setMessage] = useState("");
  const [model, setModel] = useState("gpt-4o");

  // Load preferred model from localStorage on mount safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        const savedModel = localStorage.getItem("preferred_model");
        if (savedModel) {
          setModel(savedModel);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ───── Auto-scroll to bottom ───── */
  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /* ───── Auto-resize textarea ───── */
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }
  }, [message]);

  /* ───── Mutation ───── */
  const askMutation = useMutation({
    mutationFn: (params: { msg: string; mdl: string; img?: File; doc?: File }) => {
      let apiModel: ChatAskModel = "gpt";
      if (params.mdl === "gemini-pro" || params.mdl === "gemini") apiModel = "gemini";
      else if (params.mdl === "claude-6" || params.mdl === "claude") apiModel = "claude";
      return askChatFormData({
        message: params.msg,
        model: apiModel,
        image: params.img,
        file: params.doc,
      });
    },
    onSuccess: (data) => {
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.data.content || "",
        model,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    },
    onError: (err: Error) => {
      const errMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `⚠️ ${err?.message || "Something went wrong. Please try again."}`,
        model,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    },
  });

  /* ───── Send handler ───── */
  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed && !imageFile && !docFile) return;

    const attachments: ChatMessage["attachments"] = [];
    if (imageFile) attachments.push({ name: imageFile.name, type: "image" });
    if (docFile) attachments.push({ name: docFile.name, type: "file" });

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      model,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined,
    };
    setMessages((prev) => [...prev, userMsg]);

    const currentImg = imageFile;
    const currentDoc = docFile;

    setMessage("");
    setImageFile(null);
    setDocFile(null);

    askMutation.mutate({ msg: trimmed, mdl: model, img: currentImg || undefined, doc: currentDoc || undefined });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasChat = messages.length > 0;

  return (
    <div style={{ backgroundColor: "#0A0A0F", minHeight: "100%" }}>
      {/* ===== Inline animation keyframes ===== */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .chat-msg { animation: fadeSlideUp 0.3s ease forwards; }
        .chat-input-area textarea::placeholder { color: rgba(255,255,255,0.35); }
        .chat-input-area textarea:focus { outline: none; }
        .attach-btn:hover { background-color: rgba(255,255,255,0.1) !important; }
        .send-btn:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 4px 20px rgba(108,92,231,0.4); }
        .subject-pill:hover { border-color: rgba(79,70,229,0.4) !important; color: #ffffff !important; }
        .composer-row { display: flex; align-items: flex-end; gap: 8px; padding: 4px 6px; }
        .composer-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }
        .dashboard-hero {
          padding: 100px 40px 60px;
        }
        .dashboard-hero-chatting {
          padding: 30px 40px 20px;
        }
        .dashboard-hero h1 {
          font-size: 36px;
        }
        .chat-messages-area {
          max-height: 55vh;
        }
        .chat-bubble {
          max-width: 75%;
        }
        @media (max-width: 768px) {
          .dashboard-hero {
            padding: 40px 16px 30px !important;
          }
          .dashboard-hero-chatting {
            padding: 16px 16px 12px !important;
          }
          .dashboard-hero h1 {
            font-size: 24px !important;
          }
          .chat-input-area { padding: 6px !important; }
          .composer-row { flex-wrap: wrap; gap: 6px !important; }
          .composer-row textarea { flex-basis: 100%; width: 100%; font-size: 13px !important; }
          .composer-actions { width: 100%; justify-content: space-between; }
          .chat-messages-area {
            max-height: 50vh !important;
            padding: 10px 2px !important;
          }
          .chat-bubble {
            max-width: 85% !important;
          }
        }
        @media (max-width: 480px) {
          .dashboard-hero {
            padding: 24px 12px 20px !important;
          }
          .dashboard-hero h1 {
            font-size: 20px !important;
          }
          .chat-bubble {
            max-width: 92% !important;
          }
        }
      `}</style>

      {/* ===== HERO: Chat Home ===== */}
      <section
        className={hasChat ? "dashboard-hero dashboard-hero-chatting" : "dashboard-hero"}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: hasChat ? "flex-start" : "center",
          padding: hasChat ? "30px 40px 20px" : "100px 40px 60px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
          transition: "all 0.4s ease",
        }}
      >
        {/* Greeting (hide when chatting) */}
        {!hasChat && (
          <>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", margin: "0 0 6px" }}>
              {getGreeting()} 👋
            </p>
            <h1 style={{ color: "#ffffff", fontSize: "36px", fontWeight: 700, margin: "0 0 4px", lineHeight: 1.25 }}>
              Your AI Homework Helper
            </h1>
            <h1 style={{ color: "#ffffff", fontSize: "36px", fontWeight: 700, margin: "0 0 32px", lineHeight: 1.25 }}>
              Ask anything.
            </h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", margin: "0 0 24px", maxWidth: "540px", lineHeight: 1.6 }}>
              Ask a question, upload an image, or open the calculator for quick equation work. The layout adjusts on smaller screens so the controls stay easy to reach.
            </p>
          </>
        )}

        {/* ===== CHAT MESSAGES AREA ===== */}
        {hasChat && (
          <div
            className="chat-messages-area"
            style={{
              width: "100%",
              maxWidth: "780px",
              maxHeight: "55vh",
              overflowY: "auto",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              padding: "20px 8px",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.08) transparent",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="chat-msg"
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {/* AI Avatar */}
                {msg.role === "assistant" && (
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      flexShrink: 0,
                      boxShadow: "0 3px 14px rgba(108,92,231,0.35)",
                    }}
                  >
                    <Bot size={20} strokeWidth={2} />
                  </div>
                )}

                <div
                  className="chat-bubble"
                  style={{
                    maxWidth: "75%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {/* Model label for AI messages */}
                  {msg.role === "assistant" && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.35)",
                        fontWeight: 500,
                      }}
                    >
                      {MODEL_LABELS[msg.model] || msg.model}
                    </span>
                  )}

                  {/* Attachments for user messages */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {msg.attachments.map((att, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            backgroundColor: att.type === "image" ? "rgba(79,70,229,0.15)" : "rgba(255,255,255,0.08)",
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.6)",
                          }}
                        >
                          {att.type === "image" ? "🖼️" : "📎"} {att.name.length > 20 ? att.name.slice(0, 18) + "…" : att.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      backgroundColor: msg.role === "user" ? "#4F46E5" : "#15151f",
                      border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.07)" : "none",
                      boxShadow: msg.role === "user"
                        ? "0 3px 16px rgba(79,70,229,0.3)"
                        : "0 2px 8px rgba(0,0,0,0.25)",
                    }}
                  >
                    <div
                      style={{
                        color: msg.role === "user" ? "#ffffff" : "rgba(255,255,255,0.85)",
                        fontSize: "14.5px",
                        margin: 0,
                        lineHeight: 1.7,
                        wordBreak: "break-word",
                        textAlign: "left",
                      }}
                    >
                      {renderMessageContent(msg.content)}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <span
                    style={{
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.2)",
                      textAlign: msg.role === "user" ? "right" : "left",
                    }}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      flexShrink: 0,
                      boxShadow: "0 3px 14px rgba(245,158,11,0.3)",
                    }}
                  >
                    <User size={20} strokeWidth={2} />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {askMutation.isPending && (
              <div
                className="chat-msg"
                style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {MODEL_LABELS[model]?.[0] || "AI"}
                </div>
                <div
                  style={{
                    padding: "14px 20px",
                    borderRadius: "16px 16px 16px 4px",
                    backgroundColor: "#1a1a28",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}

        {/* ===== CHAT INPUT ===== */}
        <div
          className="chat-input-area"
          style={{
            width: "100%",
            maxWidth: "720px",
            backgroundColor: "#16161f",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "16px",
            padding: "8px",
            marginBottom: "16px",
            transition: "border-color 0.2s ease",
          }}
        >
          {/* Attachment previews */}
          {(imageFile || docFile) && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "6px 10px 4px" }}>
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

          {/* Input row */}
          <div className="composer-row">
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
              onKeyDown={handleKeyDown}
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

            {/* Right-side controls */}
            <div className="composer-actions">
              <Link
                href="/dashboard/calculator"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "20px",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" x2="16" y1="6" y2="6" />
                </svg>
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", fontWeight: 500 }}>Calculator</span>
              </Link>

              <div style={{ flexShrink: 0, paddingBottom: "1px" }}>
                <ModelSelector
                  size="sm"
                  value={model}
                  onChange={(val) => {
                    setModel(val);
                    if (typeof window !== "undefined") {
                      localStorage.setItem("preferred_model", val);
                    }
                  }}
                  direction="down"
                />
              </div>
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
                onClick={handleSend}
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

        {/* Spin animation */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {/* Subject Pills (only when no active chat) */}
        {!hasChat && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            {subjectPills.map((sub) => (
              <span
                key={sub}
                className="subject-pill"
                onClick={() => setMessage(`Help me with ${sub}`)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: "transparent",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {sub}
              </span>
            ))}
            <span
              style={{
                padding: "7px 16px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              More →
            </span>
          </div>
        )}

        {/* Free questions (only when no active chat) */}
        {!hasChat && (
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>
            3 free questions remaining today.{" "}
            <span style={{ color: "#7b68ee", cursor: "pointer", fontWeight: 500 }}>Upgrade</span>
          </p>
        )}
      </section>

      {/* ===== Divider ===== */}
      {!hasChat && (
        <>
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(79,70,229,0.15), transparent)", maxWidth: "800px", margin: "0 auto" }} />

          {/* ===== Landing Sections Below ===== */}
          <CompanionSection />
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)", maxWidth: "800px", margin: "0 auto" }} />
          <AIModelSection />
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)", maxWidth: "800px", margin: "0 auto" }} />
          <SubjectsSection />
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)", maxWidth: "800px", margin: "0 auto" }} />
          <RevolutionSection />
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)", maxWidth: "800px", margin: "0 auto" }} />
          <PricingSection />
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)", maxWidth: "800px", margin: "0 auto" }} />
          <DevicesSection />
        </>
      )}
    </div>
  );
}
