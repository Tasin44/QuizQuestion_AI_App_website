"use client";
import { useState, useEffect } from "react";
import Sidebar from "./_components/Sidebar";
import TopNavbar from "./_components/TopNavbar";
import LogoutModal from "./_components/LogoutModal";
import Footer from "@/app/(dashboard)/_components/sections/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      {/* Desktop sidebar (always visible on desktop) */}
      <div className="dashboard-sidebar-desktop">
        <Sidebar onLogout={() => setShowLogoutModal(true)} onNavClick={() => {}} />
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
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 150,
          }}
        >
          <div style={{ flex: 1 }}>
            {children}
          </div>
          <Footer />
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
