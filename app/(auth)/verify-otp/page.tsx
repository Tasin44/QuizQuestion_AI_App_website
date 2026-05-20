"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "../_components/AuthCard";
import { AuthButton } from "../_components/AuthInput";

export default function VerifyOTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const inputs = useRef([]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  return (
    <AuthCard>
      <div className="text-center flex flex-col gap-2">
        <h1 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: 0 }}>
          Check your email
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>
          Enter the 6-digit code sent to example@gmail.com
        </p>
      </div>

      {/* OTP Boxes */}
      <div className="flex justify-center gap-3">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            style={{
              width: "52px",
              height: "56px",
              textAlign: "center",
              fontSize: "20px",
              fontWeight: 700,
              backgroundColor: "#1a1a24",
              border: digit ? "1px solid #7b68ee" : "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px",
              color: "#ffffff",
              outline: "none",
            }}
          />
        ))}
      </div>

      <p style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>
        {timer > 0 ? (
          <>Resend code in <span style={{ color: "#7b68ee" }}>0:{String(timer).padStart(2, "0")}</span></>
        ) : (
          <span
            onClick={() => setTimer(45)}
            style={{ color: "#7b68ee", cursor: "pointer" }}
          >
            Resend code
          </span>
        )}
      </p>

      <AuthButton onClick={() => router.push("/set-new-password")}>
        Verify Code
      </AuthButton>
    </AuthCard>
  );
}