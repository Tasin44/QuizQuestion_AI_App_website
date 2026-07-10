"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/app/(auth)/_lib/api";
import { getAccessToken } from "@/app/(auth)/_lib/authStorage";
import { ListCollapse } from "lucide-react";
import { useLanguage } from "./useLanguage";

interface TopNavbarProps {
  onLogout?: () => void;
  onMenuToggle?: () => void;
  isSidebarCollapsed?: boolean;
}

export default function TopNavbar({ onLogout, onMenuToggle, isSidebarCollapsed }: TopNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(getAccessToken()),
    staleTime: 60_000,
  });

  const name = profileQuery.data?.data?.name || "";
  const email = profileQuery.data?.data?.email || "";
  const imageUrl = profileQuery.data?.data?.image_url || "";

  const emailPrefix = email ? email.split("@")[0] : "";
  const fallbackName = emailPrefix 
    ? emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1) 
    : "User";
  const displayName = name && name.trim() ? name : fallbackName;

  const initialsSource = name || email || "U";
  const initials = initialsSource.trim().slice(0, 2).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        .topnav-logo-mobile { display: none; }
        .topnav-user-name { display: block; }
        .topnav-user-email { display: block; }
        @media (max-width: 768px) {
          .topnav-logo-mobile { display: flex !important; }
          .topnav-user-name { display: none !important; }
          .topnav-user-email { display: none !important; }
        }
      `}</style>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          backgroundColor: "#0A0A0F",
          position: "sticky",
          top: 0,
          zIndex: 100,
          gap: "12px",
        }}
      >
        {/* Left side: toggle button + mobile/collapsed logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Sidebar Toggle button (ListCollapse) */}
          <button
            onClick={onMenuToggle}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.8)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "rgba(255,255,255,0.8)";
            }}
          >
            <ListCollapse 
              size={20} 
              strokeWidth={1.8} 
              style={{ 
                transform: isSidebarCollapsed ? "rotate(180deg)" : "none", 
                transition: "transform 0.2s ease" 
              }} 
            />
          </button>

          {/* Mobile logo */}
          <div className="topnav-logo-mobile" style={{ alignItems: "center" }}>
            <img
              src="/images/ai-logo.png"
              alt="Quiz Question AI"
              style={{ height: "32px", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Right side: user profile */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <div
            onClick={() => setIsOpen(!isOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "#1a1a28",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
              padding: "6px 14px 6px 6px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7b68ee, #e040fb)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                initials
              )}
            </div>
            <div>
              <p className="topnav-user-name" style={{ color: "#fff", fontSize: "13px", fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                {displayName}
              </p>
              <p className="topnav-user-email" style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", margin: 0 }}>
                {email || ""}
              </p>
            </div>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", marginLeft: "4px" }}>
              {isOpen ? "˄" : "˅"}
            </span>
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                backgroundColor: "#111118",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "10px",
                width: "240px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                zIndex: 1000,
                boxSizing: "border-box",
              }}
            >
              {/* Profile Settings Item */}
              <div
                onClick={() => {
                  setIsOpen(false);
                  router.push("/dashboard/settings");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#111118"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 600, margin: 0 }}>
                    {t("Profile Settings")}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", margin: 0 }}>
                    {t("General")}
                  </p>
                </div>
              </div>

              {/* Logout Item */}
              <div
                onClick={() => {
                  setIsOpen(false);
                  if (onLogout) onLogout();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 51, 51, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ff3333"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 600, margin: 0 }}>
                    {t("Logout")}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", margin: 0 }}>
                    {t("Logout Account")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
