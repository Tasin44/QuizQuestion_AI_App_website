"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "../_components/AuthCard";
import { AuthInput, AuthButton } from "../_components/AuthInput";
import { useMutation } from "@tanstack/react-query";
import { login } from "../_lib/api";
import { setAuthTokens } from "../_lib/authStorage";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [googleLoginUrl, setGoogleLoginUrl] = useState("https://api.quizquestion.ai/accounts/google/login/");

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_BASE_URL || "https://api.quizquestion.ai";

    // Browser-based allauth login (redirect) -> backend mints JWT -> frontend stores tokens.
    const frontendCallbackUrl = `${window.location.origin}/oauth-callback`;
    const backendCompleteUrl = `${apiBase}/auth/social/complete/?next=${encodeURIComponent(frontendCallbackUrl)}`;

    setGoogleLoginUrl(`${apiBase}/accounts/google/login/?next=${encodeURIComponent(backendCompleteUrl)}`);
  }, []);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess: (data) => {
      setAuthTokens({ access: data.data.access, refresh: data.data.refresh });
      router.push("/dashboard");
    },
    onError: (err: Error) => {
      setError(err?.message || "Login failed.");
    },
  });

  const handleSubmit = () => {
    setError("");
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    loginMutation.mutate({ email: form.email, password: form.password });
  };

  return (
    <AuthCard>
      <h1
        style={{
          color: "#ffffff",
          fontSize: "22px",
          fontWeight: 700,
          textAlign: "center",
          margin: 0,
        }}
      >
        Welcome back
      </h1>

      <div className="flex flex-col gap-5">
        <AuthInput
          label="Email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
        />

        <div className="flex flex-col gap-1">
          <AuthInput
            label="Password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value })}
          />
          {/* Forgot Password - right aligned */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "13px",
                cursor: "pointer",
                marginTop: "6px",
                textDecoration: "underline",
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.color = "#7b68ee";
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.color = "rgba(255,255,255,0.4)";
              }}
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <p style={{ color: "#ff6b6b", fontSize: "13px", margin: "-10px 0 0", textAlign: "center" }}>
          {error}
        </p>
      )}

      <AuthButton onClick={handleSubmit} disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Signing in..." : "Sign In"}
      </AuthButton>

      <a
        href={googleLoginUrl}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          width: "100%",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.08)",
          backgroundColor: "#15151d",
          color: "#ffffff",
          fontSize: "15px",
          fontWeight: 600,
          padding: "14px 16px",
          textDecoration: "none",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget as HTMLElement;
          target.style.backgroundColor = "#1b1b26";
          target.style.borderColor = "rgba(255,255,255,0.16)";
          target.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget as HTMLElement;
          target.style.backgroundColor = "#15151d";
          target.style.borderColor = "rgba(255,255,255,0.08)";
          target.style.transform = "translateY(0)";
        }}
      >
        <img
          src="/images/google.svg"
          alt="Google"
          width={18}
          height={18}
          style={{ display: "block" }}
        />
        Continue with Google
      </a>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          margin: "-10px 0",
        }}
      >
        <div
          style={{
            flex: 1,
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        />
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>
          or
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        />
      </div>

      <p
        style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.5)",
          fontSize: "13px",
          margin: 0,
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          style={{ color: "#7b68ee", cursor: "pointer", fontWeight: 500, textDecoration: "none" }}
        >
          Sign Up
        </Link>
      </p>
    </AuthCard>
  );
}