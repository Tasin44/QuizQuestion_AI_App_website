"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthTokens } from "../_lib/authStorage";

function parseTokensFromHash(hash: string) {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(raw);
  return {
    access: params.get("access") || "",
    refresh: params.get("refresh") || "",
  };
}

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const { access, refresh } = parseTokensFromHash(window.location.hash || "");

    if (!access) {
      setError("Social login did not return an access token.");
      // Give the user a moment to read the error, then send them back.
      const t = window.setTimeout(() => router.replace("/signin"), 1200);
      return () => window.clearTimeout(t);
    }

    setAuthTokens({ access, refresh: refresh || undefined });

    // Clean up URL so tokens aren't left in the address bar/history.
    if (window.location.hash) {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }

    router.replace("/dashboard");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0A0A0F" }}>
      <div style={{ color: "white", fontSize: 14, opacity: 0.8, textAlign: "center", padding: 24 }}>
        {error ? error : "Signing you in..."}
      </div>
    </div>
  );
}
