"use client";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export function AuthInput({ label, type = "text", placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-2">
      <label style={{ color: "#ffffff", fontSize: "14px", fontWeight: 500 }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            backgroundColor: "#1a1a24",
            border: "1px solid transparent",
            borderRadius: "12px",
            color: "#ffffff",
            fontSize: "14px",
            padding: "14px 16px",
            width: "100%",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.border = "1px solid rgba(120,100,255,0.6)";
            e.target.style.boxShadow = "0 0 0 4px rgba(120,100,255,0.06)";
          }}
          onBlur={(e) => {
            e.target.style.border = "1px solid transparent";
            e.target.style.boxShadow = "none";
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide password" : "Show password"}
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.6)",
              fontSize: "18px",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
}

export function AuthButton({ children, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
        border: "none",
        borderRadius: "12px",
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: 600,
        padding: "15px",
        width: "100%",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        transition: "all 0.2s ease",
        letterSpacing: "0.3px",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.target.style.background = "linear-gradient(135deg, #7b68ee, #6c5ce7)";
        if (!disabled) e.target.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "linear-gradient(135deg, #6c5ce7, #7b68ee)";
        e.target.style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}