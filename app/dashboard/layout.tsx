"use client";
import { useState, useEffect } from "react";
import Sidebar from "./_components/Sidebar";
import TopNavbar from "./_components/TopNavbar";
import LogoutModal from "./_components/LogoutModal";
import Footer from "@/app/(dashboard)/_components/sections/Footer";
import { ChatProvider, useChatContext } from "./_components/ChatContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAuthTokens, getAccessToken } from "@/app/(auth)/_lib/authStorage";

function DashboardInner({ children }: { children: React.ReactNode }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const { hasChat } = useChatContext();

  const [authReady, setAuthReady] = useState(false);

  // If we came from social login, tokens are in the URL fragment: #access=...&refresh=...
  // Capture them before any authenticated API calls run (prevents 401 right after Google login).
  useEffect(() => {
    const hash = window.location.hash || "";
    if (hash.startsWith("#")) {
      const params = new URLSearchParams(hash.slice(1));
      const access = params.get("access") || "";
      const refresh = params.get("refresh") || "";

      if (access) {
        setAuthTokens({ access, refresh: refresh || undefined });
            // Remove tokens from the URL immediately and again shortly after
            const cleanUrl = window.location.pathname + window.location.search;
            try {
              window.history.replaceState({}, document.title, cleanUrl);
            } catch (e) {
              // ignore
            }
            // Defensive: ensure fragment is cleared in case some other script re-adds it
            setTimeout(() => {
              try {
                if (window.location.hash) {
                  window.history.replaceState({}, document.title, cleanUrl);
                  window.location.hash = '';
                }
              } catch (e) {
                // ignore
              }
            }, 150);
      }
    }

    setAuthReady(true);
  }, []);


  // Close sidebar on route change or resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);


  const handleMenuToggle = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setDesktopSidebarOpen(!desktopSidebarOpen);
    }
  };

  // Defensive client-side redirect: if we don't have an access token, redirect to signin
  useEffect(() => {
    const tok = getAccessToken();
    if (!tok) {
      try {
        window.location.replace('/signin');
      } catch (e) {
        // ignore
      }
    }
  }, []);

  if (!authReady) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0A0A0F", color: "rgba(255,255,255,0.75)" }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0A0A0F" }}>
      {/* Global responsive styles */}
      <style>{`
        .dashboard-sidebar-desktop {
          display: block;
        }
        .dashboard-sidebar-mobile-overlay {
          display: none;
        }
        @media (max-width: 768px) {
          .dashboard-sidebar-desktop {
            display: none !important;
          }
          .dashboard-sidebar-mobile-overlay {
            display: block !important;
          }
        }
      `}</style>

      {/* Desktop sidebar */}
      <div 
        className="dashboard-sidebar-desktop"
        style={{
          width: desktopSidebarOpen ? "260px" : "80px",
          overflow: "hidden",
          transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.06)",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <Sidebar onLogout={() => setShowLogoutModal(true)} onNavClick={() => {}} collapsed={!desktopSidebarOpen} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="dashboard-sidebar-mobile-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9000,
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
            }}
          />
          {/* Sidebar drawer */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "280px",
              maxWidth: "85vw",
              animation: "slideInLeft 0.25s ease forwards",
              zIndex: 1,
            }}
          >
            <Sidebar
              onLogout={() => { setSidebarOpen(false); setShowLogoutModal(true); }}
              onNavClick={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <TopNavbar
          onLogout={() => setShowLogoutModal(true)}
          onMenuToggle={handleMenuToggle}
          isSidebarCollapsed={!desktopSidebarOpen}
        />
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1 }}>
            {children}
          </div>
          {!hasChat && <Footer />}
        </main>
      </div>
      {showLogoutModal && (
        <LogoutModal onClose={() => setShowLogoutModal(false)} />
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatProvider>
      <DashboardInner>{children}</DashboardInner>
    </ChatProvider>
  );
}
