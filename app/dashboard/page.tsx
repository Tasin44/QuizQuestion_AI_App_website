"use client";
import { useState } from "react";
import Link from "next/link";
import CompanionSection from "./_components/sections/CompanionSection";
import AIModelSection from "./_components/sections/AIModelSection";
import SubjectsSection from "./_components/sections/SubjectsSection";
import RevolutionSection from "./_components/sections/RevolutionSection";
import PricingSection from "./_components/sections/PricingSection";
import DevicesSection from "./_components/sections/DevicesSection";
import ModelSelector from "./_components/ModelSelector";
import { useMutation } from "@tanstack/react-query";
import { askChat, type ChatAskModel } from "@/app/(auth)/_lib/api";

const subjectPills = ["Math", "Physics", "Chemistry", "Biology", "Statistics"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
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

  return (
    <div style={{ backgroundColor: "#0A0A0F", minHeight: "100%" }}>
      {/* ===== HERO: Chat Home ===== */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 40px 60px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Greeting */}
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", margin: "0 0 6px" }}>
          {getGreeting()} 👋
        </p>
        <h1 style={{ color: "#ffffff", fontSize: "36px", fontWeight: 700, margin: "0 0 4px", lineHeight: 1.25 }}>
          Your AI Homework Helper
        </h1>
        <h1 style={{ color: "#ffffff", fontSize: "36px", fontWeight: 700, margin: "0 0 32px", lineHeight: 1.25 }}>
          Ask anything.
        </h1>

        {/* Model & Calculator Pills */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
          {/* Dynamic Model Selector */}
          <ModelSelector size="md" value={model} onChange={setModel} />

          {/* Calculator pill */}
          <Link
            href="/dashboard/calculator"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              cursor: "pointer",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" x2="16" y1="6" y2="6" />
            </svg>
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", fontWeight: 500 }}>Calculator</span>
          </Link>
        </div>

        {/* Chat Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#16161f",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "14px",
            padding: "10px 10px 10px 18px",
            width: "100%",
            maxWidth: "620px",
            marginBottom: "16px",
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.3)" strokeWidth={1.8}>
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
              fontSize: "14px",
            }}
          />
          <button
            onClick={handleAsk}
            disabled={askMutation.isPending}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
              border: "none",
              cursor: askMutation.isPending ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>

        {response && (
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", margin: "0 0 16px" }}>
            {response}
          </p>
        )}

        {/* Subject Pills */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          {subjectPills.map((sub) => (
            <span
              key={sub}
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
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(79,70,229,0.4)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
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

        {/* Free questions */}
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>
          3 free questions remaining today.{" "}
          <span style={{ color: "#7b68ee", cursor: "pointer", fontWeight: 500 }}>Upgrade</span>
        </p>
      </section>

      {/* ===== Divider ===== */}
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
    </div>
  );
}
