"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getChatHistory, askChatFormData, type ChatAskModel } from "@/app/(auth)/_lib/api";
import ModelSelector from "../../_components/ModelSelector";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  timestamp: Date;
  attachments?: { name: string; type: "image" | "file" }[];
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

// Render inline elements like bold (**), triple stars (***), or backticks (`)
function renderInlineMarkdown(text: string) {
  if (!text) return "";

  // Split by inline code first
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

    // Format bold/italic stars
    // Handle triple asterisks: ***text*** -> Bold + Italic
    // Handle double asterisks: **text** -> Bold
    // Handle single asterisk: *text* -> Italic
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

  // Process code blocks first
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

    // Process normal text line by line
    const lines = part.split("\n");
    return (
      <div key={index}>
        {lines.map((line, lineIdx) => {
          const cleanLine = line;

          // Render bullet lists cleanly
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

          // Render numbered lists cleanly
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

          // Render headers cleanly
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

          // Normal line
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


export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || "");

  const { data: historyData, isLoading, error } = useQuery({
    queryKey: ["chatHistory"],
    queryFn: getChatHistory,
  });

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
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
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
      },
      {
        id: "ai-init",
        role: "assistant",
        content: item.ai_response,
        timestamp: new Date(item.created_at),
        model: "gpt",
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
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }
  }, [message]);

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
          {currentItem?.prompt || "Chat details"}
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: "24px 32px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
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
            Failed to load chat details.
          </p>
        )}

        {!isLoading && !error && messages.map((msg) => (
          <div
            key={msg.id}
            className="chat-msg"
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "760px",
              width: "100%",
              margin: "0 auto",
            }}
          >
            {/* AI Avatar */}
            {msg.role === "assistant" && (
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
                  boxShadow: "0 2px 12px rgba(108,92,231,0.3)",
                }}
              >
                {msg.model ? (MODEL_LABELS[msg.model]?.[0] || "AI") : "AI"}
              </div>
            )}

            <div
              style={{
                maxWidth: "75%",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {msg.role === "assistant" && (
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
                  {msg.model ? (MODEL_LABELS[msg.model] || msg.model) : "GPT"}
                </span>
              )}

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
                      {att.type === "image" ? "🖼️" : "📎"} {att.name}
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
                  {renderMessageContent(msg.content)}
                </div>
              </div>

              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", textAlign: msg.role === "user" ? "right" : "left" }}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {/* User Avatar */}
            {msg.role === "user" && (
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                U
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {askMutation.isPending && (
          <div
            className="chat-msg"
            style={{ display: "flex", gap: "12px", alignItems: "flex-start", maxWidth: "760px", width: "100%", margin: "0 auto" }}
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

      {/* Chat Input + Model Selector at the right side */}
      <div style={{ padding: "16px 32px 24px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        {/* Attachment previews */}
        {(imageFile || docFile) && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", maxWidth: "860px", margin: "0 auto 8px", padding: "0 4px" }}>
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
                🖼️ {imageFile.name}
                <button
                  onClick={() => setImageFile(null)}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "14px", padding: "0 2px" }}
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
            maxWidth: "860px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {/* Chat Input Container */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
              gap: "8px",
              backgroundColor: "#16161f",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "16px",
              padding: "8px",
            }}
          >
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
              placeholder="Type your question..."
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
      `}</style>
    </div>
  );
}
