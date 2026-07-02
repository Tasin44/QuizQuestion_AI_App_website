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
import { Bot, User, Image as ImageIcon, Paperclip, Send } from "lucide-react";
import { useChatContext } from "./_components/ChatContext";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

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
            animation: "typingBounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

const preprocessMarkdown = (content: string) => {
  if (!content) return "";
  
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => {
      // Replace block math delimiters \[ \] or \[ ] with $$
      // Replace inline math delimiters \( \) or \( ) with $
      let processed = paragraph
        .replace(/\\+\[([\s\S]*?)(?:\\+\]|\])/g, "$$$$\n$1\n$$$$")
        .replace(/\\+\(([\s\S]*?)(?:\\+\)|\))/g, "$$$1$$");

      // Defensive auto-close for unbalanced block math ($$) inside this paragraph
      const doubleDollarCount = (processed.match(/\$\$/g) || []).length;
      if (doubleDollarCount % 2 !== 0) {
        processed += "\n$$";
      }

      // Defensive auto-close for unbalanced inline math ($) inside this paragraph
      const singleDollarCount = (processed.replace(/\$\$/g, "").match(/\$/g) || []).length;
      if (singleDollarCount % 2 !== 0) {
        processed += "$";
      }

      return processed;
    })
    .join("\n\n");
};

/* ───── Markdown components for react-markdown ───── */
const markdownComponents = {
  h1: ({ children, ...props }: any) => <h2 style={{ fontSize: "19px", fontWeight: 700, margin: "20px 0 10px", color: "#fff" }} {...props}>{children}</h2>,
  h2: ({ children, ...props }: any) => <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "16px 0 8px", color: "#fff" }} {...props}>{children}</h3>,
  h3: ({ children, ...props }: any) => <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "12px 0 6px", color: "#fff" }} {...props}>{children}</h4>,
  p: ({ children, ...props }: any) => <p style={{ margin: "6px 0", lineHeight: "1.7", color: "inherit" }} {...props}>{children}</p>,
  strong: ({ children, ...props }: any) => <strong style={{ fontWeight: 700, color: "#fff" }} {...props}>{children}</strong>,
  em: ({ children, ...props }: any) => <em style={{ fontStyle: "italic" }} {...props}>{children}</em>,
  ul: ({ children, ...props }: any) => <ul style={{ margin: "6px 0", paddingLeft: "20px", listStyleType: "disc" }} {...props}>{children}</ul>,
  ol: ({ children, ...props }: any) => <ol style={{ margin: "6px 0", paddingLeft: "20px" }} {...props}>{children}</ol>,
  li: ({ children, ...props }: any) => <li style={{ margin: "4px 0", lineHeight: "1.6", color: "inherit" }} {...props}>{children}</li>,
  code: ({ children, className, ...props }: any) => {
    if (className?.startsWith("language-")) {
      return <code style={{ color: "#e2e8f0", background: "none", padding: 0, fontFamily: "monospace", fontSize: "13px" }} {...props}>{children}</code>;
    }
    return <code style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", fontFamily: "monospace", color: "#ef4444" }} {...props}>{children}</code>;
  },
  pre: ({ children, ...props }: any) => (
    <pre style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "14px 16px", borderRadius: "10px", fontFamily: "monospace", fontSize: "13px", overflowX: "auto", maxWidth: "100%", margin: "10px 0", border: "1px solid rgba(255,255,255,0.06)", color: "#e2e8f0", lineHeight: 1.6 }} {...props}>
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote style={{ borderLeft: "3px solid rgba(108,92,231,0.5)", paddingLeft: "14px", margin: "10px 0", color: "rgba(255,255,255,0.6)", fontStyle: "italic" }} {...props}>
      {children}
    </blockquote>
  ),
  a: ({ children, href, ...props }: any) => (
    <a href={href} style={{ color: "#7b68ee", textDecoration: "underline" }} target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  ),
  table: ({ children, ...props }: any) => <div style={{ overflowX: "auto", margin: "10px 0" }}><table style={{ borderCollapse: "collapse", width: "100%", fontSize: "13px" }} {...props}>{children}</table></div>,
  th: ({ children, ...props }: any) => <th style={{ borderBottom: "1px solid rgba(255,255,255,0.12)", padding: "8px 12px", textAlign: "left", color: "#fff", fontWeight: 600 }} {...props}>{children}</th>,
  td: ({ children, ...props }: any) => <td style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "8px 12px", color: "rgba(255,255,255,0.75)" }} {...props}>{children}</td>,
};

export default function ClientDashboard() {
  const { setHasChat } = useChatContext();
  const [message, setMessage] = useState("");
  const [model, setModel] = useState("auto");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const savedModel = localStorage.getItem("preferred_model");
    if (savedModel) setModel(savedModel);
  }, []);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      const targetHeight = ta.scrollHeight;
      ta.style.height = Math.min(targetHeight, 240) + "px";
      ta.style.overflowY = targetHeight > 240 ? "auto" : "hidden";
    }
  }, [message]);

  const askMutation = useMutation({
    mutationFn: (params: { msg: string; mdl: string; img?: File; doc?: File }) => {
      let apiModel: ChatAskModel = "gpt";
      if (params.mdl === "gemini-pro" || params.mdl === "gemini") apiModel = "gemini";
      else if (params.mdl.startsWith("claude") || params.mdl === "claude") apiModel = "claude";
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
    onError: (err: any) => {
      const aiError: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `⚠️ Error: ${err.message || "Failed to get response"}`,
        model,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiError]);
    },
  });

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed && !imageFile && !docFile) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      model,
      timestamp: new Date(),
      attachments: [
        ...(imageFile ? [{ name: imageFile.name, type: "image" as const }] : []),
        ...(docFile ? [{ name: docFile.name, type: "file" as const }] : []),
      ],
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    const img = imageFile;
    const doc = docFile;
    setImageFile(null);
    setDocFile(null);

    askMutation.mutate({ 
      msg: trimmed, 
      mdl: model, 
      img: img || undefined, 
      doc: doc || undefined 
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasChat = messages.length > 0;

  useEffect(() => {
    setHasChat(hasChat);
    return () => setHasChat(false);
  }, [hasChat, setHasChat]);

  return (
    <div style={{ backgroundColor: "#0A0A0F", minHeight: "100vh" }}>
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        .chat-msg { animation: fadeSlideUp 0.3s ease forwards; }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>

      <section 
        className={`${
          hasChat 
            ? "pt-[30px] pb-[20px] px-4 sm:px-10" 
            : "pt-[100px] pb-[60px] px-4 sm:px-10"
        } w-full max-w-[1200px] mx-auto text-center flex flex-col items-center`}
        style={{
          transition: "all 0.4s ease",
        }}
      >
        {!hasChat && (
          <>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", margin: "0 0 6px" }}>{getGreeting()} 👋</p>
            <h1 style={{ color: "#ffffff", fontSize: "36px", fontWeight: 700, margin: "0 0 4px", lineHeight: 1.25 }}>Your AI Homework Helper</h1>
            <h1 style={{ color: "#ffffff", fontSize: "36px", fontWeight: 700, margin: "0 0 32px", lineHeight: 1.25 }}>Ask anything.</h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", margin: "0 0 24px", maxWidth: "540px", lineHeight: 1.6 }}>Ask a question, upload an image, or open the calculator. Everything stays safe and protected.</p>
          </>
        )}

        {hasChat && (
          <div className="no-scrollbar" style={{
            width: "100%", maxWidth: "960px", maxHeight: "calc(100vh - 220px)",
            overflowY: "auto", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "20px", padding: "20px 8px"
          }}>
            {messages.map((msg) => (
              <div key={msg.id} className="chat-msg" style={{ display: "flex", gap: "12px", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.role === "assistant" && (
                  <div className="hidden sm:flex" style={{ width: "38px", height: "38px", borderRadius: "12px", background: "linear-gradient(135deg, #6c5ce7, #7b68ee)", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}><Bot size={20} /></div>
                )}
                <div className={msg.role === "assistant" ? "w-full max-w-full sm:w-auto sm:max-w-[75%]" : "max-w-[88%] sm:max-w-[75%]"} style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "left", minWidth: 0 }}>
                  <div style={{ padding: "14px 18px", borderRadius: "18px", backgroundColor: msg.role === "user" ? "#4F46E5" : "#15151f", border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.07)" : "none", color: "#fff", minWidth: 0 }}>
                  {msg.role === "assistant" ? (
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={markdownComponents}>{preprocessMarkdown(msg.content)}</ReactMarkdown>
                  ) : (
                    <>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div style={{ display: "flex", gap: "6px", marginBottom: msg.content ? "8px" : "0", flexWrap: "wrap" }}>
                          {msg.attachments.map((att, i) => (
                            <span key={i} style={{ background: "rgba(0,0,0,0.2)", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                              {att.type === "image" ? <ImageIcon size={12} style={{ color: "rgba(255,255,255,0.7)" }} /> : <Paperclip size={12} style={{ color: "rgba(255,255,255,0.7)" }} />} <span style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{att.name}</span>
                            </span>
                          ))}
                        </div>
                      )}
                      {msg.content}
                    </>
                  )}
                  </div>
                </div>
              </div>
            ))}
            {askMutation.isPending && <div style={{ textAlign: "left" }}><TypingIndicator /></div>}
            <div ref={chatEndRef} />
          </div>
        )}

        <div style={{ width: "100%", maxWidth: "960px", display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
          {(imageFile || docFile) && (
            <div style={{ display: "flex", gap: "8px", padding: "0 4px", flexWrap: "wrap" }}>
              {imageFile && (
                <div style={{ background: "rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: "12px", fontSize: "13px", color: "#eee", display: "flex", alignItems: "center", gap: "6px" }}>
                  <ImageIcon size={13} style={{ color: "rgba(255,255,255,0.7)" }} /> <span style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{imageFile.name}</span>
                  <button onClick={() => setImageFile(null)} style={{ background: "none", border: "none", color: "#ff4757", cursor: "pointer", padding: "0 0 0 4px", fontSize: "14px", lineHeight: 1 }}>&times;</button>
                </div>
              )}
              {docFile && (
                <div style={{ background: "rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: "12px", fontSize: "13px", color: "#eee", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Paperclip size={13} style={{ color: "rgba(255,255,255,0.7)" }} /> <span style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{docFile.name}</span>
                  <button onClick={() => setDocFile(null)} style={{ background: "none", border: "none", color: "#ff4757", cursor: "pointer", padding: "0 0 0 4px", fontSize: "14px", lineHeight: 1 }}>&times;</button>
                </div>
              )}
            </div>
          )}
          <div className="w-full bg-[#16161f] border border-[rgba(255,255,255,0.09)] rounded-2xl p-3 flex flex-wrap gap-2 items-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] box-border sm:flex-nowrap sm:gap-3 sm:items-end">
            <button 
              onClick={() => imageInputRef.current?.click()} 
              className="order-1 flex items-center justify-center shrink-0 sm:order-none"
              style={{ background: imageFile ? "rgba(79, 70, 229, 0.3)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: "10px", padding: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <ImageIcon size={16} style={{ color: "rgba(255,255,255,0.7)" }} />
            </button>
            <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={(e) => setImageFile(e.target.files?.[0] || null)} onClick={(e) => { (e.target as HTMLInputElement).value = '' }} />

            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="order-1 flex items-center justify-center shrink-0 sm:order-none"
              style={{ background: docFile ? "rgba(79, 70, 229, 0.3)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: "10px", padding: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Paperclip size={16} style={{ color: "rgba(255,255,255,0.7)" }} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              hidden
              onChange={(e) => setDocFile(e.target.files?.[0] || null)}
              onClick={(e) => { (e.target as HTMLInputElement).value = '' }}
            />
            
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="w-full flex-none order-first bg-transparent border-none focus:ring-0 focus:outline-none text-white resize-none outline-none py-2 text-sm leading-relaxed caret-[#7b68ee] box-border sm:w-auto sm:flex-1 sm:order-none sm:py-2"
              rows={1}
              style={{ transition: "height 0.1s ease-out" }}
            />

            <div className="order-2 ml-auto shrink-0 flex items-center sm:order-none sm:ml-0">
              <ModelSelector 
                value={model} 
                onChange={(val) => {
                  setModel(val);
                  localStorage.setItem("preferred_model", val);
                }} 
                direction="down" 
              />
            </div>
            {(message.trim() || imageFile || docFile) && (
              <button 
                onClick={handleSend} 
                disabled={askMutation.isPending} 
                className="order-3 shrink-0 sm:order-none"
                style={{ 
                  background: "linear-gradient(135deg, #6c5ce7, #7b68ee)", 
                  border: "none", 
                  borderRadius: "10px", 
                  padding: "8px", 
                  color: "#fff", 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "36px",
                  height: "36px"
                }}
              >
                <Send size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {!hasChat && (
        <div style={{ marginTop: "40px" }}>
          <PricingSection />
        </div>
      )}
    </div>
  );
}
