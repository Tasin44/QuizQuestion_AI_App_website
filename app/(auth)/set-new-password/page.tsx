"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "../_components/AuthCard";
import { AuthInput, AuthButton } from "../_components/AuthInput";

export default function SetNewPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });

  return (
    <AuthCard>
      <h1 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, textAlign: "center", margin: 0 }}>
        Set new password
      </h1>

      <div className="flex flex-col gap-5">
        <AuthInput
          label="New Password"
          type="password"
          placeholder="New Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <AuthInput
          label="Confirm New Password"
          type="password"
          placeholder="Confirm New Password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />
      </div>

      <AuthButton onClick={() => router.push("/password-changed")}>
        Change Password
      </AuthButton>
    </AuthCard>
  );
}