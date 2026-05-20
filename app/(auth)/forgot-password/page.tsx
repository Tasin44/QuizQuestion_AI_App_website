"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "../_components/AuthCard";
import { AuthInput, AuthButton } from "../_components/AuthInput";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    // API call to send OTP/reset link can be added here
    router.push("/verify-otp");
  };

  return (
    <AuthCard>
      <div className="text-center flex flex-col gap-2">
        <h1 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: 0 }}>
          Forgot Password
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>
          Enter your email address to receive a verification code.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <AuthInput
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
        />
      </div>

      <AuthButton onClick={handleSubmit}>
        Send Code
      </AuthButton>

      <p
        style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.5)",
          fontSize: "13px",
          margin: 0,
        }}
      >
        Remembered your password?{" "}
        <Link
          href="/signin"
          style={{ color: "#7b68ee", cursor: "pointer", fontWeight: 500, textDecoration: "none" }}
        >
          Sign In
        </Link>
      </p>
    </AuthCard>
  );
}
