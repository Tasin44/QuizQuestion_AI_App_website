"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getChatHistory, askChatFormData, type ChatAskModel } from "@/app/(auth)/_lib/api";
import ModelSelector from "../../_components/ModelSelector";
import { useChatContext } from "../../_components/ChatContext";
import { Bot, User, Check, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useLanguage } from "../../_components/useLanguage";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  timestamp: Date;
  attachments?: { name: string; type: "image" | "file" }[];
  imageUrl?: string;
}

const MODEL_LABELS: Record<string, string> = {
  gpt: "GPT",
  claude: "Claude",
  gemini: "Gemini",
};

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

const preprocessMarkdown = (content: string) => {
  if (!content) return "";
  return content
    .replace(/\\+\[/g, "$$")
    .replace(/\\+\]/g, "$$")
    .replace(/\\+\(/g, "$")
    .replace(/\\+\)/g, "$");
};

/* ───── Markdown components for react-markdown ───── */
const mdComponents = {
  h1: ({ children, ...p }: React.ComponentProps<"h1">) => <h2 style={{ fontSize: "19px", fontWeight: 700, margin: "20px 0 10px", color: "#fff" }} {...p}>{children}</h2>,
  h2: ({ children, ...p }: React.ComponentProps<"h2">) => <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "16px 0 8px", color: "#fff" }} {...p}>{children}</h3>,
  h3: ({ children, ...p }: React.ComponentProps<"h3">) => <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "12px 0 6px", color: "#fff" }} {...p}>{children}</h4>,
  p: ({ children, ...p }: React.ComponentProps<"p">) => <p style={{ margin: "6px 0", lineHeight: "1.7", color: "inherit" }} {...p}>{children}</p>,
  strong: ({ children, ...p }: React.ComponentProps<"strong">) => <strong style={{ fontWeight: 700, color: "#fff" }} {...p}>{children}</strong>,
  em: ({ children, ...p }: React.ComponentProps<"em">) => <em style={{ fontStyle: "italic" }} {...p}>{children}</em>,
  ul: ({ children, ...p }: React.ComponentProps<"ul">) => <ul style={{ margin: "6px 0", paddingLeft: "20px", listStyleType: "disc" }} {...p}>{children}</ul>,
  ol: ({ children, ...p }: React.ComponentProps<"ol">) => <ol style={{ margin: "6px 0", paddingLeft: "20px" }} {...p}>{children}</ol>,
  li: ({ children, ...p }: React.ComponentProps<"li">) => <li style={{ margin: "4px 0", lineHeight: "1.6", color: "inherit" }} {...p}>{children}</li>,
  code: ({ children, className, ...p }: React.ComponentProps<"code"> & { className?: string }) => {
    if (className?.startsWith("language-")) return <code style={{ color: "#e2e8f0", background: "none", padding: 0, fontFamily: "monospace", fontSize: "13px" }} {...p}>{children}</code>;
    return <code style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", fontFamily: "monospace", color: "#e2e8f0" }} {...p}>{children}</code>;
  },
  pre: ({ children, ...p }: React.ComponentProps<"pre">) => <pre style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "14px 16px", borderRadius: "10px", fontFamily: "monospace", fontSize: "13px", overflowX: "auto", maxWidth: "100%", margin: "10px 0", border: "1px solid rgba(255,255,255,0.06)", color: "#e2e8f0", lineHeight: 1.6 }} {...p}>{children}</pre>,
  blockquote: ({ children, ...p }: React.ComponentProps<"blockquote">) => <blockquote style={{ borderLeft: "3px solid rgba(108,92,231,0.5)", paddingLeft: "14px", margin: "10px 0", color: "rgba(255,255,255,0.6)", fontStyle: "italic" }} {...p}>{children}</blockquote>,
  a: ({ children, href, ...p }: React.ComponentProps<"a">) => <a href={href} style={{ color: "#7b68ee", textDecoration: "underline" }} target="_blank" rel="noreferrer" {...p}>{children}</a>,
  table: ({ children, ...p }: React.ComponentProps<"table">) => <div style={{ overflowX: "auto", margin: "10px 0" }}><table style={{ borderCollapse: "collapse", width: "100%", fontSize: "13px" }} {...p}>{children}</table></div>,
  th: ({ children, ...p }: React.ComponentProps<"th">) => <th style={{ borderBottom: "1px solid rgba(255,255,255,0.12)", padding: "8px 12px", textAlign: "left", color: "#fff", fontWeight: 600 }} {...p}>{children}</th>,
  td: ({ children, ...p }: React.ComponentProps<"td">) => <td style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "8px 12px", color: "rgba(255,255,255,0.75)" }} {...p}>{children}</td>,
};


export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || "");
  const { setHasChat } = useChatContext();
  const { t } = useLanguage();

  /* Signal layout to hide footer */
  useEffect(() => {
    setHasChat(true);
    return () => setHasChat(false);
  }, [setHasChat]);

  const { data: historyData, isLoading, error } = useQuery({
    queryKey: ["chatHistory"],
    queryFn: getChatHistory,
  });

  const [model, setModel] = useState("auto");

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
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Generate preview URL when imageFile changes
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreviewUrl(null);
    }
  }, [imageFile]);
  const [extraMessages, setExtraMessages] = useState<ChatMessage[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messages = useMemo<ChatMessage[]>(() => {
    const item = historyData?.data?.find((x) => x.id === id);

    if (!item) {
      return extraMessages;
    }

    const initialMessages: ChatMessage[] = [
      {
        id: "user-init",
        role: "user",
        content: item.prompt,
        timestamp: new Date(item.created_at),
        attachments: [
          ...(item.image_url ? [{ name: "Image Attachment", type: "image" as const }] : []),
          ...(item.file_url ? [{ name: "File Attachment", type: "file" as const }] : []),
        ],
        imageUrl: item.image_url || undefined,
      },
      {
        id: "ai-init",
        role: "assistant",
        content: item.ai_response,
        timestamp: new Date(item.created_at),
        model: "gpt",
        imageUrl: item.image_url || undefined,
      },
    ];

    return [...initialMessages, ...extraMessages];
  }, [extraMessages, historyData?.data, id]);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      const targetHeight = ta.scrollHeight;
      ta.style.height = Math.min(targetHeight, 200) + "px";
      ta.style.overflowY = targetHeight > 200 ? "auto" : "hidden";
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
      setExtraMessages((prev) => [...prev, aiMsg]);
    },
    onError: (err: Error) => {
      const errMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `⚠️ ${err?.message || "Something went wrong. Please try again."}`,
        model,
        timestamp: new Date(),
      };
      setExtraMessages((prev) => [...prev, errMsg]);
    },
  });

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed && !imageFile && !docFile) return;

    // Capture the preview URL before clearing state
    const currentImagePreviewUrl = imagePreviewUrl;

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
      imageUrl: currentImagePreviewUrl || undefined,
    };
    setExtraMessages((prev) => [...prev, userMsg]);

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

  const currentItem = historyData?.data?.find((x) => x.id === id);
  const tagInfo = currentItem ? getTagDetails(currentItem.prompt) : { tag: "General", color: "#8b5cf6" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "calc(100vh - 64px)" }}>
      {/* Lightbox overlay */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.88)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "lightboxFadeIn 0.2s ease",
            cursor: "zoom-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", animation: "lightboxZoomIn 0.2s ease" }}
          >
            <img
              src={lightboxUrl}
              alt="Full preview"
              style={{ maxWidth: "90vw", maxHeight: "88vh", borderRadius: "14px", boxShadow: "0 20px 60px rgba(0,0,0,0.8)", objectFit: "contain" }}
            />
            <button
              onClick={() => setLightboxUrl(null)}
              style={{
                position: "absolute", top: "-12px", right: "-12px",
                width: "28px", height: "28px", borderRadius: "50%",
                background: "rgba(30,30,40,0.95)", border: "1.5px solid rgba(255,255,255,0.25)",
                color: "#fff", cursor: "pointer", fontSize: "15px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >&times;</button>
          </div>
        </div>
      )}
      {/* Keyframe animations */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chat-msg { animation: fadeSlideUp 0.3s ease forwards; }
        .attach-btn:hover { background-color: rgba(255,255,255,0.1) !important; }
        .send-btn:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 4px 20px rgba(108,92,231,0.4); }
        .chat-img-thumb {
          cursor: zoom-in;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .chat-img-thumb:hover {
          transform: scale(1.04);
          box-shadow: 0 4px 20px rgba(0,0,0,0.6);
        }
        @keyframes lightboxFadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes lightboxZoomIn {
          from { transform: scale(0.88); opacity: 0; } to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          padding: "16px 32px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          onClick={() => router.push("/dashboard/history")}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            padding: "6px 10px",
            cursor: "pointer",
            color: "rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(79,70,229,0.4)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <span
          style={{
            padding: "3px 10px",
            borderRadius: "12px",
            backgroundColor: `${tagInfo.color}20`,
            color: tagInfo.color,
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          {tagInfo.tag}
        </span>
        <span style={{ color: "#ffffff", fontSize: "15px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>
          {currentItem?.prompt || t("Chat details")}
        </span>
      </div>

      {/* Messages */}
      <div className="no-scrollbar flex-1 overflow-y-auto flex flex-col px-4 py-6 sm:px-8 sm:py-6">
        <div style={{ maxWidth: "960px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
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
            {t("Failed to load chat details.")}
          </p>
        )}

        {!isLoading && !error && messages.map((msg, msgIndex) => {
          return (
          <div
            key={msg.id}
            className="chat-msg"
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "100%",
              width: "100%",
              margin: "0 auto",
            }}
          >
            {/* AI Avatar */}
            {msg.role === "assistant" && (
              <div
                className="hidden sm:flex"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
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
              className={msg.role === "assistant" ? "w-full max-w-full sm:w-auto sm:max-w-[75%]" : "max-w-[88%] sm:max-w-[75%]"}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                minWidth: 0,
              }}
            >
              {msg.role === "assistant" && (
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
                  {msg.model ? (MODEL_LABELS[msg.model] || msg.model) : "GPT"}
                </span>
              )}

              {msg.role === "user" && msg.imageUrl && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <img
                    src={msg.imageUrl}
                    alt="Attached"
                    className="chat-img-thumb"
                    onClick={() => setLightboxUrl(msg.imageUrl!)}
                    style={{ maxWidth: "180px", maxHeight: "140px", objectFit: "cover", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)" }}
                  />
                </div>
              )}

              {msg.attachments && msg.attachments.filter(a => a.type !== "image").length > 0 && (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {msg.attachments.filter(a => a.type !== "image").map((att, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(255,255,255,0.08)",
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      📎 {att.name}
                    </span>
                  ))}
                </div>
              )}

              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  backgroundColor: msg.role === "user" ? "#4F46E5" : "#1a1a28",
                  border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.06)" : "none",
                  boxShadow: msg.role === "user"
                    ? "0 2px 12px rgba(79,70,229,0.25)"
                    : "0 1px 4px rgba(0,0,0,0.2)",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    color: msg.role === "user" ? "#ffffff" : "rgba(255,255,255,0.8)",
                    fontSize: "14px",
                    margin: 0,
                    lineHeight: 1.65,
                    wordBreak: "break-word",
                    textAlign: "left",
                  }}
                >
                  {msg.role === "assistant" ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={mdComponents}>
                        {preprocessMarkdown(msg.content)}
                      </ReactMarkdown>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg.content);
                          setCopiedMessageId(msg.id);
                          setTimeout(() => setCopiedMessageId(null), 2000);
                        }}
                        style={{
                          background: "none", border: "none", color: copiedMessageId === msg.id ? "#10b981" : "rgba(255,255,255,0.4)",
                          cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px",
                          marginTop: "12px", alignSelf: "flex-end", padding: "4px 8px", borderRadius: "6px", transition: "all 0.2s ease"
                        }}
                        title="Copy response"
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        {copiedMessageId === msg.id ? <Check size={14} /> : <Copy size={14} />} {copiedMessageId === msg.id ? t("Copied!") : t("Copy")}
                      </button>
                    </div>
                  ) : msg.content}
                </div>
              </div>

              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", textAlign: msg.role === "user" ? "right" : "left" }}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {/* User Avatar */}
            {msg.role === "user" && (
              <div
                className="hidden sm:flex"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #f59e0b, #ef4444)",
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
          );
        })}

        {/* Typing indicator */}
        {askMutation.isPending && (
          <div
            className="chat-msg"
            style={{ display: "flex", gap: "12px", alignItems: "flex-start", maxWidth: "100%", width: "100%", margin: "0 auto" }}
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
      </div>

      {/* Chat Input + Model Selector at the right side */}
      <div style={{ padding: "16px 32px 24px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        {/* Attachment previews */}
        {(imageFile || docFile) && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", maxWidth: "960px", margin: "0 auto 8px", padding: "0 4px" }}>
            {imageFile && imagePreviewUrl && (
              <div style={{ position: "relative", display: "inline-block" }}>
                <img src={imagePreviewUrl} alt="Preview" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)" }} />
                <button
                  onClick={() => setImageFile(null)}
                  style={{ position: "absolute", top: "-6px", right: "-6px", width: "20px", height: "20px", borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", lineHeight: 1, padding: 0 }}
                >
                  ×
                </button>
              </div>
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
                📎 {docFile.name}
                <button
                  onClick={() => setDocFile(null)}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "14px", padding: "0 2px" }}
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "12px",
            maxWidth: "960px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {/* Chat Input Container */}
          <div className="w-full bg-[#16161f] border border-[rgba(255,255,255,0.09)] rounded-2xl p-2 px-3 flex flex-wrap gap-2 items-center shadow-2xl box-border sm:flex-nowrap sm:gap-2 sm:items-end">
            {/* Image upload */}
            <button
              className="attach-btn order-1 flex items-center justify-center shrink-0 sm:order-none"
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
              className="attach-btn order-1 flex items-center justify-center shrink-0 sm:order-none"
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
              accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.png,.jpg,.jpeg"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && f.type.startsWith('image/')) {
                  setImageFile(f);
                } else if (f) {
                  setDocFile(f);
                }
                e.target.value = "";
              }}
            />

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("Type your question...")}
              rows={1}
              className="w-full flex-none order-first bg-transparent border-none focus:ring-0 focus:outline-none text-white resize-none outline-none py-2 text-sm leading-relaxed caret-[#7b68ee] box-border sm:w-auto sm:flex-1 sm:order-none sm:py-2"
              style={{ transition: "height 0.1s ease-out" }}
            />

            {/* Model Selector inside input field on the right side */}
            <div className="order-2 ml-auto shrink-0 flex items-center sm:order-none sm:ml-0" style={{ paddingBottom: "1px" }}>
              <ModelSelector
                size="sm"
                value={model}
                onChange={(val) => {
                  setModel(val);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("preferred_model", val);
                  }
                }}
                direction="up"
              />
            </div>

            {/* Send button (animates and displays only when input is typed or file uploaded) */}
            <div
              className="order-3 shrink-0 sm:order-none"
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
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
    </div>
  );
}
