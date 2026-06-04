"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MessageSquarePlus, 
  Calculator, 
  BookOpen, 
  AppWindow, 
  Settings, 
  History 
} from "lucide-react";

interface SidebarProps {
  onLogout: () => void;
  onNavClick?: () => void;
  collapsed?: boolean;
}

const navItems = [
  {
    label: "New Chat",
    href: "/dashboard",
    icon: <MessageSquarePlus size={20} strokeWidth={1.8} />,
  },
  {
    label: "Calculator",
    href: "/dashboard/calculator",
    icon: <Calculator size={20} strokeWidth={1.8} />,
  },
  {
    label: "Materials",
    href: "/dashboard/resources",
    icon: <BookOpen size={20} strokeWidth={1.8} />,
  },
  {
    label: "App",
    href: "/dashboard/app",
    icon: <AppWindow size={20} strokeWidth={1.8} />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings size={20} strokeWidth={1.8} />,
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: <History size={20} strokeWidth={1.8} />,
  },
];

export default function Sidebar({ onLogout, onNavClick, collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: collapsed ? "80px" : "260px",
        minHeight: "100vh",
        backgroundColor: "#111118",
        borderRight: "none",
        display: "flex",
        flexDirection: "column",
        padding: collapsed ? "28px 12px 16px" : "28px 16px 16px",
        position: "sticky",
        top: 0,
        height: "100vh",
        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1), padding 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Logo */}
      <div 
        style={{ 
          padding: collapsed ? "0" : "0 8px", 
          marginBottom: "40px",
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-start",
          transition: "all 0.25s ease",
        }}
      >
        <img
          src="/images/ai-logo.png"
          alt="Quiz Question AI"
          style={{ 
            height: "36px", 
            width: collapsed ? "32px" : "auto",
            objectFit: "cover",
            objectPosition: "left",
            transition: "width 0.25s ease",
          }}
        />
      </div>

      {/* Navigation */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              title={collapsed ? item.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: collapsed ? "0" : "14px",
                padding: "12px 14px",
                borderRadius: "10px",
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
                backgroundColor: isActive ? "rgba(79,70,229,0.12)" : "transparent",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                }
              }}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        title={collapsed ? "Logout" : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: collapsed ? "0" : "14px",
          padding: "14px",
          borderRadius: "10px",
          backgroundColor: "rgba(220, 38, 38, 0.12)",
          border: "1px solid rgba(220, 38, 38, 0.2)",
          color: "#ef4444",
          fontSize: "15px",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s ease",
          width: "100%",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(220, 38, 38, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(220, 38, 38, 0.12)";
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
        </svg>
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}
