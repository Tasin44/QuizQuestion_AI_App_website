"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "../_components/AuthCard";
import { AuthInput, AuthButton } from "../_components/AuthInput";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });

  const handleSubmit = () => {
    // API call here
    router.push("/verify-otp");
  };

  return (
    <AuthCard>
      <h1 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, textAlign: "center", margin: 0 }}>
        Create your account
      </h1>

      <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }} />

      <div className="flex flex-col gap-5">
        <AuthInput
          label="Email"
          type="email"
          placeholder="example@gmail.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <AuthInput
          label="Password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <AuthInput
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />
      </div>

      <AuthButton onClick={handleSubmit}>Create Account</AuthButton>

      <div className="text-center" style={{ marginTop: "-10px" }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", margin: "0 0 8px" }}>or</p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0 }}>
          Already have an account?{" "}
          <span
            onClick={() => router.push("/signin")}
            style={{ color: "#7b68ee", cursor: "pointer", fontWeight: 500 }}
          >
            Sign In
          </span>
        </p>
      </div>
    </AuthCard>
  );
}