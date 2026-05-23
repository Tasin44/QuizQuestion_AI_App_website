"use client";
import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "../_components/AuthCard";
import { AuthButton } from "../_components/AuthInput";
import { useMutation } from "@tanstack/react-query";
import { verifyOtp, verifyResetOtp, type VerifyOtpResponse, type ResetVerifyOtpResponse } from "../_lib/api";
import {
  getPendingEmail,
  clearPendingEmail,
  setAuthTokens,
  setResetSecret,
  getOtpFlow,
  clearOtpFlow,
} from "../_lib/authStorage";

export default function VerifyOTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [email] = useState(() => getPendingEmail());
  const [error, setError] = useState("");
  const [flow] = useState(() => getOtpFlow());
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const verifyMutation = useMutation<VerifyOtpResponse | ResetVerifyOtpResponse, Error, { otpCode: string; emailValue: string; otpFlow: string }>({
    mutationFn: ({ otpCode, emailValue, otpFlow }) => {
      if (otpFlow === "reset") {
        return verifyResetOtp(emailValue, otpCode);
      }
      return verifyOtp(emailValue, otpCode);
    },
    onSuccess: (data, variables) => {
      if (variables.otpFlow === "reset") {
        setResetSecret((data as { data: { secret_key: string } }).data.secret_key);
        router.push("/set-new-password");
        return;
      }
      const authData = data as { data: { access: string; refresh: string } };
      setAuthTokens({ access: authData.data.access, refresh: authData.data.refresh });
      clearPendingEmail();
      clearOtpFlow();
      router.push("/dashboard");
    },
    onError: (err: Error) => {
      setError(err?.message || "Verification failed.");
    },
  });

  const handleVerify = () => {
    const otpCode = otp.join("");
    setError("");
    if (!email) {
      setError(flow === "reset" ? "Email not found. Please try again." : "Email not found. Please sign up again.");
      return;
    }
    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    verifyMutation.mutate({ otpCode, emailValue: email, otpFlow: flow });
  };

  return (
    <AuthCard>
      <div className="text-center flex flex-col gap-2">
        <h1 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: 0 }}>
          Check your email
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>
          Enter the 6-digit code sent to {email || "your email"}
        </p>
      </div>

      {/* OTP Boxes */}
      <div className="flex justify-center gap-3">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            maxLength={1}
            value={digit}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(i, e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(i, e)}
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

      {error && (
        <p style={{ color: "#ff6b6b", fontSize: "13px", margin: "-10px 0 0", textAlign: "center" }}>
          {error}
        </p>
      )}

      <AuthButton onClick={handleVerify} disabled={verifyMutation.isPending}>
        {verifyMutation.isPending ? "Verifying..." : "Verify Code"}
      </AuthButton>
    </AuthCard>
  );
}