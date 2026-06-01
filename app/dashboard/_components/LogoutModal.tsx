"use client";
import { useRouter } from "next/navigation";

interface LogoutModalProps {
  onClose: () => void;
}

export default function LogoutModal({ onClose }: LogoutModalProps) {
  const router = useRouter();

  const handleLogout = () => {
    onClose();
    router.push("/signin");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div style={{ marginBottom: "32px" }}>
        <img src="/images/ai-logo.png" alt="Quiz Question AI" style={{ height: "48px", objectFit: "contain" }} />
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#111118",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "40px 28px",
          width: "100%",
          maxWidth: "440px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: 0 }}>Logout?</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", margin: 0, textAlign: "center" }}>Are you sure you want to logout?</p>
        <div style={{ display: "flex", gap: "12px", width: "100%", marginTop: "8px", flexWrap: "wrap" }}>
          <button onClick={onClose} style={{ flex: "1 1 140px", padding: "13px", borderRadius: "10px", background: "#4F46E5", border: "none", color: "#ffffff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>No, Cancel</button>
          <button onClick={handleLogout} style={{ flex: "1 1 140px", padding: "13px", borderRadius: "10px", background: "#dc2626", border: "none", color: "#ffffff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Yes, Logout</button>
        </div>
      </div>
    </div>
  );
}
