"use client";
import { useRouter } from "next/navigation";
import AuthCard from "../_components/AuthCard";
import { AuthButton } from "../_components/AuthInput";

export default function PasswordChangedPage() {
  const router = useRouter();

  return (
    <AuthCard>
      <div className="flex flex-col items-center gap-4">
        {/* Success Icon */}
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "rgba(34, 197, 94, 0.15)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px",
          }}
        >
          ✓
        </div>

        <div className="text-center">
          <h1 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: "0 0 8px" }}>
            Password changed!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>
            You can now sign in with your new password.
          </p>
        </div>
      </div>

      <AuthButton onClick={() => router.push("/signin")}>
        Back to Sign In
      </AuthButton>
    </AuthCard>
  );
}