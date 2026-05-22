"use client";

import type { AuthTokens } from "./api";

const ACCESS_TOKEN_KEY = "qqai_access_token";
const REFRESH_TOKEN_KEY = "qqai_refresh_token";
const PENDING_EMAIL_KEY = "qqai_pending_email";
const OTP_FLOW_KEY = "qqai_otp_flow";
const RESET_SECRET_KEY = "qqai_reset_secret";

function setCookie(name: string, value: string, days = 7) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

function getCookie(name: string) {
  const key = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith(key)) {
      return decodeURIComponent(trimmed.substring(key.length));
    }
  }
  return "";
}

export function setAuthTokens(tokens: AuthTokens) {
  if (!tokens?.access) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  setCookie(ACCESS_TOKEN_KEY, tokens.access, 7);

  if (tokens.refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
    setCookie(REFRESH_TOKEN_KEY, tokens.refresh, 14);
  }
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || getCookie(ACCESS_TOKEN_KEY) || "";
}

export function setPendingEmail(email: string) {
  if (!email) return;
  localStorage.setItem(PENDING_EMAIL_KEY, email);
}

export function getPendingEmail() {
  return localStorage.getItem(PENDING_EMAIL_KEY) || "";
}

export function clearPendingEmail() {
  localStorage.removeItem(PENDING_EMAIL_KEY);
}

export type OtpFlow = "signup" | "reset";

export function setOtpFlow(flow: OtpFlow) {
  localStorage.setItem(OTP_FLOW_KEY, flow);
}

export function getOtpFlow(): OtpFlow | "" {
  return (localStorage.getItem(OTP_FLOW_KEY) as OtpFlow) || "";
}

export function clearOtpFlow() {
  localStorage.removeItem(OTP_FLOW_KEY);
}

export function setResetSecret(secret: string) {
  if (!secret) return;
  localStorage.setItem(RESET_SECRET_KEY, secret);
}

export function getResetSecret() {
  return localStorage.getItem(RESET_SECRET_KEY) || "";
}

export function clearResetSecret() {
  localStorage.removeItem(RESET_SECRET_KEY);
}
