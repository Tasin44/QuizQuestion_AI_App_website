"use client";
import { useState } from "react";

const aiModels = [
  { id: "gpt-4o", name: "GPT-4o", badge: "OpenAI", badgeColor: "#22c55e", desc: "Best for complex reasoning & long answers", icon: "🤖" },
  { id: "gemini", name: "Gemini Pro", badge: "Google", badgeColor: "#4285f4", desc: "Excellent for math, code, and multimodal tasks", icon: "💎" },
  { id: "claude", name: "Claude 3.5", badge: "Anthropic", badgeColor: "#f59e0b", desc: "Great for writing, analysis & nuanced content", icon: "⚡" },
];

const responseStyles = [
  { id: "concise", name: "Concise", desc: "Short & to the point", icon: "⚡" },
  { id: "balanced", name: "Balanced", desc: "Clear with context", icon: "⚖️" },
  { id: "detailed", name: "Detailed", desc: "Full explanation", icon: "📖" },
  { id: "formal", name: "Formal", desc: "Academic tone", icon: "🎓" },
];

const subjects = [
  { id: "mathematics", name: "Mathematics", icon: "📐" },
  { id: "physics", name: "Physics", icon: "⚛️" },
  { id: "chemistry", name: "Chemistry", icon: "⚗️" },
  { id: "biology", name: "Biology", icon: "🧬" },
  { id: "history", name: "History", icon: "📚" },
  { id: "cs", name: "CS", icon: "💻" },
  { id: "literature", name: "Literature", icon: "📝" },
  { id: "economics", name: "Economics", icon: "📊" },
];

const cardStyle = {
  backgroundColor: "#111118",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: "16px",
  padding: "24px 28px",
  width: "100%",
  boxSizing: "border-box",
};

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  backgroundColor: "#0A0A0F",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "#ffffff",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  color: "rgba(255,255,255,0.55)",
  fontSize: "12px",
  fontWeight: 500,
  marginBottom: "6px",
  display: "block",
};

function Toggle({ active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: "40px", height: "22px", borderRadius: "11px",
        backgroundColor: active ? "#22c55e" : "rgba(255,255,255,0.15)",
        cursor: "pointer", position: "relative", transition: "all 0.2s ease",
        flexShrink: 0,
      }}
    >
      <div style={{
        width: "16px", height: "16px", borderRadius: "50%",
        backgroundColor: "#fff", position: "absolute", top: "3px",
        left: active ? "21px" : "3px", transition: "all 0.2s ease",
      }} />
    </div>
  );
}

export default function SettingsPage() {
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [responseStyle, setResponseStyle] = useState("balanced");
  const [difficulty, setDifficulty] = useState(50);
  const [selectedSubjects, setSelectedSubjects] = useState(["mathematics", "physics"]);
  const [parentalRole, setParentalRole] = useState("parent");
  const [email, setEmail] = useState("");
  const [chatHistoryExport, setChatHistoryExport] = useState(true);

  const toggleSubject = (id) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const getDiffLabel = () => {
    if (difficulty < 25) return "Beginner";
    if (difficulty < 50) return "Intermediate";
    if (difficulty < 75) return "Advanced";
    return "Expert";
  };

  return (
    <div style={{ backgroundColor: "#0A0A0F", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Page Body */}
      <div style={{ flex: 1, padding: "32px 36px" }}>

        {/* Logo */}
        <div style={{ marginBottom: "28px" }}>
          <img src="/images/ai-logo.png" alt="Quiz Question AI" style={{ height: "36px", objectFit: "contain" }} />
        </div>

        {/* 2 Column Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "24px", alignItems: "flex-start" }}>

          {/* ===== LEFT ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Profile Settings */}
            <div style={cardStyle}>
              <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: "0 0 18px" }}>Profile Settings</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input type="text" placeholder="Name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" placeholder="example@gmail.com" style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div style={cardStyle}>
              <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: "0 0 18px" }}>Change Password</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { label: "Current Password", placeholder: "Password" },
                  { label: "Password", placeholder: "Password" },
                  { label: "Confirm Password", placeholder: "Confirm Password" },
                ].map((field) => (
                  <div key={field.label}>
                    <label style={labelStyle}>{field.label}</label>
                    <div style={{ position: "relative" }}>
                      <input type="password" placeholder={field.placeholder} style={inputStyle} />
                      <span style={{
                        position: "absolute", right: "12px", top: "50%",
                        transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)",
                        cursor: "pointer", fontSize: "13px",
                      }}>👁</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ===== RIGHT ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* AI Personalization */}
            <div style={cardStyle}>
              <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: "0 0 18px" }}>AI Personalization</h2>

              {/* Models */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {aiModels.map((m) => {
                  const isActive = m.id === selectedModel;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "12px 16px",
                        backgroundColor: isActive ? "rgba(79,70,229,0.07)" : "rgba(255,255,255,0.02)",
                        border: isActive ? "1px solid rgba(79,70,229,0.35)" : "1px solid rgba(255,255,255,0.04)",
                        borderRadius: "12px", cursor: "pointer", transition: "all 0.2s ease",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>{m.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                          <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>{m.name}</span>
                          <span style={{
                            padding: "1px 7px", borderRadius: "10px",
                            backgroundColor: `${m.badgeColor}20`, color: m.badgeColor,
                            fontSize: "10px", fontWeight: 600,
                          }}>{m.badge}</span>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", margin: "2px 0 0" }}>{m.desc}</p>
                      </div>
                      <div style={{
                        width: "18px", height: "18px", borderRadius: "50%",
                        border: `2px solid ${isActive ? "#22c55e" : "rgba(255,255,255,0.15)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        {isActive && <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e" }} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Response Style */}
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 600, margin: "0 0 10px" }}>Response Style</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {responseStyles.map((rs) => {
                    const isActive = rs.id === responseStyle;
                    return (
                      <div
                        key={rs.id}
                        onClick={() => setResponseStyle(rs.id)}
                        style={{
                          padding: "11px 13px",
                          backgroundColor: isActive ? "rgba(79,70,229,0.1)" : "rgba(255,255,255,0.02)",
                          border: isActive ? "1px solid rgba(79,70,229,0.3)" : "1px solid rgba(255,255,255,0.04)",
                          borderRadius: "10px", cursor: "pointer", transition: "all 0.2s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                          <span style={{ fontSize: "13px" }}>{rs.icon}</span>
                          <span style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.55)", fontSize: "12px", fontWeight: 600 }}>{rs.name}</span>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", margin: "2px 0 0", paddingLeft: "20px" }}>{rs.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <h3 style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 600, margin: 0 }}>Difficulty Level</h3>
                  <span style={{ color: "#7b68ee", fontSize: "11px", fontWeight: 600 }}>{getDiffLabel()}</span>
                </div>
                <input
                  type="range" min="0" max="100" value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#4F46E5", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  {["Beginner", "Intermediate", "Advanced", "Expert"].map((l) => (
                    <span key={l} style={{ color: "rgba(255,255,255,0.22)", fontSize: "10px" }}>{l}</span>
                  ))}
                </div>
              </div>

              {/* Subject Focus */}
              <div style={{ marginBottom: "22px" }}>
                <h3 style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 600, margin: "0 0 10px" }}>Subject Focus Area</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {subjects.map((s) => {
                    const isSelected = selectedSubjects.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleSubject(s.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: "5px",
                          padding: "6px 12px", borderRadius: "20px",
                          backgroundColor: isSelected ? "rgba(79,70,229,0.12)" : "rgba(255,255,255,0.02)",
                          border: isSelected ? "1px solid rgba(79,70,229,0.3)" : "1px solid rgba(255,255,255,0.06)",
                          color: isSelected ? "#fff" : "rgba(255,255,255,0.45)",
                          fontSize: "12px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease",
                        }}
                      >
                        <span>{s.icon}</span>
                        <span>{s.name}</span>
                        {isSelected && <span style={{ fontSize: "10px", color: "#7b68ee" }}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button style={{
                width: "100%", padding: "13px",
                background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
                border: "none", borderRadius: "10px", color: "#fff",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              }}>
                ✨ Save Preferences
              </button>
            </div>

            {/* Parental Control */}
            <div style={cardStyle}>
              <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: "0 0 16px" }}>Parental Control</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                {[
                  { id: "parent", title: "Parent", desc: "Add managing abilities as parent" },
                  { id: "child", title: "Child", desc: "Add Your Child" },
                ].map((item) => (
                  <div key={item.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "13px 16px",
                    backgroundColor: parentalRole === item.id ? "rgba(79,70,229,0.06)" : "rgba(255,255,255,0.02)",
                    border: parentalRole === item.id ? "1px solid rgba(79,70,229,0.2)" : "1px solid rgba(255,255,255,0.04)",
                    borderRadius: "12px",
                  }}>
                    <div>
                      <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, margin: 0 }}>{item.title}</p>
                      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", margin: "2px 0 0" }}>{item.desc}</p>
                    </div>
                    <Toggle active={parentalRole === item.id} onClick={() => setParentalRole(item.id)} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Enter Email</label>
                <input
                  type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com" style={inputStyle}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button style={{
                  padding: "11px", backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
                  color: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                }}>See Child&apos;s Activity</button>
                <button style={{
                  padding: "11px",
                  background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
                  border: "none", borderRadius: "10px", color: "#fff",
                  fontSize: "12px", fontWeight: 600, cursor: "pointer",
                }}>Send Invite</button>
              </div>
            </div>

            {/* Explore Your Data */}
            <div style={cardStyle}>
              <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: "0 0 16px" }}>Explore your Data</h2>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "13px 16px", backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", marginBottom: "14px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <div>
                    <span style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}>Chat History</span>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginLeft: "8px" }}>156 conversations · 2.6 MB</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>~1.2 MB</span>
                  <Toggle active={chatHistoryExport} onClick={() => setChatHistoryExport(!chatHistoryExport)} />
                </div>
              </div>
              <button style={{
                width: "100%", padding: "13px",
                background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
                border: "none", borderRadius: "10px", color: "#fff",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              }}>⬇ Export Selected Data</button>
            </div>

          </div>
        </div>
      </div>

       
    </div>
  );
}