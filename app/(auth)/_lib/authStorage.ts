"use client";

import type { AuthTokens } from "./api";

const ACCESS_TOKEN_KEY = "qqai_access_token";
const REFRESH_TOKEN_KEY = "qqai_refresh_token";
const PENDING_EMAIL_KEY = "qqai_pending_email";
const OTP_FLOW_KEY = "qqai_otp_flow";
const RESET_SECRET_KEY = "qqai_reset_secret";

function isBrowser() {
  return typeof window !== "undefined";
}

function setCookie(name: string, value: string, days = 7) {
  if (!isBrowser()) return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

function getCookie(name: string) {
  if (!isBrowser()) return "";
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
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  setCookie(ACCESS_TOKEN_KEY, tokens.access, 7);

  if (tokens.refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
    setCookie(REFRESH_TOKEN_KEY, tokens.refresh, 14);
  }
}

export function getAccessToken() {
  if (!isBrowser()) return "";
  return localStorage.getItem(ACCESS_TOKEN_KEY) || getCookie(ACCESS_TOKEN_KEY) || "";
}

export function setPendingEmail(email: string) {
  if (!email) return;
  if (!isBrowser()) return;
  localStorage.setItem(PENDING_EMAIL_KEY, email);
}

export function getPendingEmail() {
  if (!isBrowser()) return "";
  return localStorage.getItem(PENDING_EMAIL_KEY) || "";
}

export function clearPendingEmail() {
  if (!isBrowser()) return;
  localStorage.removeItem(PENDING_EMAIL_KEY);
}

export type OtpFlow = "signup" | "reset";

export function setOtpFlow(flow: OtpFlow) {
  if (!isBrowser()) return;
  localStorage.setItem(OTP_FLOW_KEY, flow);
}

export function getOtpFlow(): OtpFlow | "" {
  if (!isBrowser()) return "";
  return (localStorage.getItem(OTP_FLOW_KEY) as OtpFlow) || "";
}

export function clearOtpFlow() {
  if (!isBrowser()) return;
  localStorage.removeItem(OTP_FLOW_KEY);
}

export function setResetSecret(secret: string) {
  if (!secret) return;
  if (!isBrowser()) return;
  localStorage.setItem(RESET_SECRET_KEY, secret);
}

export function getResetSecret() {
  if (!isBrowser()) return "";
  return localStorage.getItem(RESET_SECRET_KEY) || "";
}

export function clearResetSecret() {
  if (!isBrowser()) return;
  localStorage.removeItem(RESET_SECRET_KEY);
}

export function clearAuthTokens() {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  
  // Clear cookies by setting max-age to 0
  document.cookie = `${ACCESS_TOKEN_KEY}=; Max-Age=0; Path=/; SameSite=Lax`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; Max-Age=0; Path=/; SameSite=Lax`;
  document.cookie = "token=; Max-Age=0; Path=/; SameSite=Lax";
  document.cookie = "access=; Max-Age=0; Path=/; SameSite=Lax";
}
