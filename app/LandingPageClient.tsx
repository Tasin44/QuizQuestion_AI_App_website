"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Sparkles, Settings, Image as ImageIcon, Paperclip, Send, Wand2, Compass, Cpu, History, X } from "lucide-react";
import ModelSelector from "./dashboard/_components/ModelSelector";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function LandingPageClient() {
  const [message, setMessage] = useState("");
  const [model, setModel] = useState("claude-sonnet-4-6");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
    }
  }, [message]);

  const triggerAuthModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    // 1. Add user message to local state so they see it in the background
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    setMessages([userMsg]);
    setMessage("");

    // 2. Show a brief typing indicator to make it feel alive
    setIsThinking(true);

    // 3. Open the Grok-style modal after a short delay
    setTimeout(() => {
      setIsThinking(false);
      setIsModalOpen(true);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Dynamically determine greetings
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const hasChat = messages.length > 0;

  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh", display: "flex", flexDirection: "column", color: "#ffffff", fontFamily: "var(--font-sans), sans-serif" }}>
      {/* Header */}
      <header style={{
        height: "64px",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        {/* Left: Brand Logo & Title */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#111118" }}>
            <img src="/images/ai-logo.png" alt="Quiz Question AI Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.2px" }}>Quiz Question AI</span>
        </Link>

        {/* Right: Guest controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button 
            onClick={triggerAuthModal}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px", padding: "6px 14px", color: "rgba(255, 255, 255, 0.85)",
              fontSize: "13px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
            }}
          >
            <Sparkles size={14} style={{ color: "#a855f7" }} />
            Imagine
          </button>

          <button 
            onClick={triggerAuthModal}
            style={{
              background: "none", border: "none", color: "rgba(255, 255, 255, 0.65)",
              cursor: "pointer", padding: "8px", display: "flex", alignItems: "center",
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
          >
            <Settings size={18} />
          </button>

          <Link 
            href="/signin" 
            style={{
              fontSize: "14px", fontWeight: 600, color: "rgba(255, 255, 255, 0.85)",
              textDecoration: "none", transition: "color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)"}
          >
            Sign in
          </Link>

          <Link 
            href="/signup" 
            style={{
              backgroundColor: "#ffffff", color: "#000000",
              borderRadius: "20px", padding: "8px 18px", fontSize: "14px", fontWeight: 600,
              textDecoration: "none", transition: "opacity 0.2s", display: "inline-block"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Main chat interface */}
      <main style={{
        flex: 1,
        display: "flex",
        boxSizing: "border-box",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: hasChat ? "space-between" : "center",
        padding: hasChat ? "40px 24px 24px" : "80px 24px 80px",
        maxWidth: "960px",
        width: "100%",
        margin: "0 auto",
      }}>
        {/* Guest greetings state */}
        {!hasChat ? (
          <div style={{ textAlign: "center", marginBottom: "40px", animation: "fadeIn 0.5s ease" }}>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "15px", margin: "0 0 8px" }}>
              {getGreeting()} 👋
            </p>
            <h1 style={{ color: "#ffffff", fontSize: "42px", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
              Your AI Homework Helper
            </h1>
            <h1 style={{ color: "#ffffff", fontSize: "42px", fontWeight: 800, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
              Ask anything.
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>
              Ask a question, upload an image, or open the calculator. Everything stays safe and protected.
            </p>
          </div>
        ) : (
          /* Active temporary conversation state in the background */
          <div style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, justifyContent: "flex-end", marginBottom: "40px" }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", justifyContent: "flex-end", margin: "16px 0", animation: "fadeSlideUp 0.3s ease" }}>
                <div style={{
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  padding: "14px 20px",
                  borderRadius: "18px 18px 0px 18px",
                  maxWidth: "75%",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)"
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isThinking && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", margin: "8px 0", paddingLeft: "12px", color: "rgba(255,255,255,0.4)" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.6)", animation: "bounce 0.8s infinite 0.1s" }} />
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.6)", animation: "bounce 0.8s infinite 0.2s" }} />
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.6)", animation: "bounce 0.8s infinite 0.3s" }} />
              </div>
            )}
          </div>
        )}

        {/* Input box */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{
            width: "100%",
            backgroundColor: "#16161f",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "16px",
            padding: "12px",
            display: "flex",
            gap: "12px",
            alignItems: "flex-end",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
          }}>
            {/* Image attachment */}
            <button 
              onClick={triggerAuthModal}
              style={{
                background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "10px",
                padding: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"}
            >
              <ImageIcon size={18} style={{ color: "rgba(255,255,255,0.7)" }} />
            </button>

            {/* File attachment */}
            <button 
              onClick={triggerAuthModal}
              style={{
                background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "10px",
                padding: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"}
            >
              <Paperclip size={18} style={{ color: "rgba(255,255,255,0.7)" }} />
            </button>

            {/* Input area */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              style={{
                flex: 1, background: "none", border: "none", color: "#ffffff",
                resize: "none", outline: "none", padding: "8px 0", fontSize: "14px",
                lineHeight: "1.5", caretColor: "#7b68ee"
              }}
              rows={1}
            />

            {/* Model Selector */}
            <ModelSelector 
              value={model} 
              onChange={(val) => {
                setModel(val);
                localStorage.setItem("preferred_model", val);
              }}
              direction="up"
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              style={{
                background: message.trim() ? "linear-gradient(135deg, #6c5ce7, #7b68ee)" : "rgba(255,255,255,0.04)",
                border: "none", borderRadius: "10px", padding: "10px 18px", color: message.trim() ? "#ffffff" : "rgba(255,255,255,0.3)",
                fontSize: "13px", fontWeight: 600, cursor: message.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s"
              }}
            >
              Send
            </button>
          </div>
        </div>
      </main>

      {/* Grok-style sign-up popup modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          zIndex: 10000,
          animation: "fadeIn 0.2s ease"
        }}>
          {/* Modal Container */}
          <div style={{
            position: "relative",
            width: "100%",
            maxWidth: "680px",
            backgroundColor: "#0f0f15",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.8)",
            display: "flex",
            flexDirection: "row",
            overflow: "hidden",
            animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}>
            {/* Close button */}
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setMessages([]); // reset chat state on dismiss
              }}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
              }}
            >
              <X size={16} />
            </button>

            {/* Left side: Signup call-to-action */}
            <div style={{
              flex: "1.1",
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}>
              <h2 style={{
                color: "#ffffff",
                fontSize: "22px",
                fontWeight: 700,
                lineHeight: "1.3",
                margin: "0 0 8px",
              }}>
                Continue your conversation
              </h2>
              <p style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: "13.5px",
                lineHeight: "1.5",
                margin: "0 0 28px"
              }}>
                Sign up to continue seamlessly with Quiz Question AI's full power
              </p>

              <Link 
                href="/signup"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  textAlign: "center",
                  borderRadius: "24px",
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(255, 255, 255, 0.15)",
                  transition: "transform 0.15s ease",
                  display: "block"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
              >
                Sign up for free
              </Link>
            </div>

            {/* Right side: App capabilities highlights */}
            <div style={{
              flex: "0.9",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.06)",
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "20px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ color: "#a855f7" }}><Wand2 size={16} /></div>
                <span style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "12.5px", fontWeight: 500 }}>Make stunning AI images & videos</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ color: "#3b82f6" }}><Cpu size={16} /></div>
                <span style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "12.5px", fontWeight: 500 }}>Use Skills & Connectors</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ color: "#10b981" }}><Compass size={16} /></div>
                <span style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "12.5px", fontWeight: 500 }}>Generate files</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ color: "#f59e0b" }}><History size={16} /></div>
                <span style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "12.5px", fontWeight: 500 }}>Chat history</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global styles inject */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
