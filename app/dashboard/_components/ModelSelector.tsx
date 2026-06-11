"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { Sparkles } from "lucide-react";

/* ───── Image Logo Components ───── */

function QQAILogo({ size = 28 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a28", flexShrink: 0 }}>
      <img src="/images/ai-logo.png" alt="QQ AI" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
}

function GPTLogo({ size = 28 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a28", flexShrink: 0 }}>
      <img src="/images/gpt.png" alt="GPT" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
}

function GeminiLogo({ size = 28 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a28", flexShrink: 0 }}>
      <img src="/images/gemini.png" alt="Gemini" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
}

function ClaudeLogo({ size = 28 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a28", flexShrink: 0 }}>
      <img src="/images/claude.png" alt="Claude" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
}

function AutoLogo({ size = 28 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #22c55e, #10b981)", flexShrink: 0, boxShadow: "0 2px 8px rgba(34, 197, 94, 0.25)" }}>
      <Sparkles size={size * 0.55} color="#ffffff" strokeWidth={2.5} />
    </div>
  );
}

const models = [
  {
    id: "auto",
    name: "Auto",
    desc: "Smart",
    color: "#22c55e",
    apiModel: "gpt",
    Logo: AutoLogo,
  },
  {
    id: "qq-ai",
    name: "QQ AI",
    desc: "Quick",
    color: "#7b68ee",
    apiModel: "gpt",
    Logo: QQAILogo,
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    desc: "General",
    color: "#10a37f",
    apiModel: "gpt",
    Logo: GPTLogo,
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    desc: "Research",
    color: "#4285f4",
    apiModel: "gemini",
    Logo: GeminiLogo,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    desc: "Fast",
    color: "#38bdf8",
    apiModel: "gpt",
    Logo: GPTLogo, // Use gpt.png
  },
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    desc: "Nuanced",
    color: "#f59e0b",
    apiModel: "claude",
    Logo: ClaudeLogo,
  },
  {
    id: "claude-opus-4-6",
    name: "Claude Opus 4.6",
    desc: "Research",
    color: "#f59e0b",
    apiModel: "claude",
    Logo: ClaudeLogo,
  },
];

interface ModelSelectorProps {
  size?: "sm" | "md";
  value?: string;
  onChange?: (value: string) => void;
  direction?: "up" | "down";
  height?: string | number;
  borderRadius?: string | number;
}

export default function ModelSelector({ size = "sm", value, onChange, direction = "down", height, borderRadius }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(value ?? models[0].id);
  const ref = useRef<HTMLDivElement>(null);

  const selectedValue = value ?? internalValue;
  const selected = useMemo(() => {
    return models.find((m) => m.id === selectedValue || m.apiModel === selectedValue) ?? models[0];
  }, [selectedValue]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        display: "inline-block",
        zIndex: open ? 2000 : 1,
      }}
    >
      {/* Pill Trigger */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          height: height || (size === "sm" ? "32px" : "40px"),
          padding: "0 14px",
          backgroundColor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: borderRadius || "20px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxSizing: "border-box",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        }}
      >
        <selected.Logo size={16} />
        <span style={{ color: "#ffffff", fontSize: size === "sm" ? "12px" : "13px", fontWeight: 600 }}>
          {selected.name}
        </span>
        <span
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "10px",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            display: "inline-block",
            lineHeight: 1,
            marginLeft: "2px",
          }}
        >
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            ...(direction === "up" 
              ? { bottom: "calc(100% + 8px)" } 
              : { top: "calc(100% + 8px)" }
            ),
            right: "0",
            backgroundColor: "#16161f",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "14px",
            padding: "8px",
            minWidth: "220px",
            zIndex: 9999,
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            animation: "fadeIn 0.15s ease",
          }}
        >
          {models.map((m) => {
            const isActive = m.id === selected.id;
            const LogoComponent = m.Logo;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setInternalValue(m.id);
                  setOpen(false);
                  if (onChange) onChange(m.id);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: isActive ? "rgba(79,70,229,0.1)" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <LogoComponent size={28} />
                <div style={{ flex: 1, textAlign: "left" }}>
                  <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 600, margin: 0 }}>{m.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", margin: 0 }}>{m.desc}</p>
                </div>
                {isActive && (
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
