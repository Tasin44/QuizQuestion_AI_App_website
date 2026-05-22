"use client";
import Link from "next/link";
import { AiFillTikTok } from "react-icons/ai";
import { FaFacebook, FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const footerLinks = {
  Product: ["Features", "Pricing", "AI Models", "Mobile App"],
  Materials: ["Help Center", "Blog", "Tutorials", "API Docs"],
  Company: ["About Us", "Careers", "Contact", "Privacy Policy"],
};

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/quizquestionai",
    icon: FaFacebook,
  },
  {
    label: "X",
    href: "https://x.com/quizquestionai",
    icon: FaSquareXTwitter,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/quizquestionai/",
    icon: FaInstagramSquare,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@quizquestionai",
    icon: AiFillTikTok,
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "50px 40px 30px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
        {/* Logo & Tagline */}
        <div style={{ maxWidth: "280px" }}>
          <img
            src="/images/ai-logo.png"
            alt="Quiz Question AI"
            style={{ height: "38px", objectFit: "contain", marginBottom: "14px" }}
          />
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
            Your AI-powered homework companion. Get instant help with any subject, anytime.
          </p>
        </div>

        {/* Link Columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 style={{ color: "#ffffff", fontSize: "14px", fontWeight: 600, margin: "0 0 16px" }}>
              {title}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {links.map((link) => (
                <Link
                  key={link}
                  href="#"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "13px",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", margin: 0 }}>
          © 2026 Quiz Question AI. All rights reserved.
        </p>
        <div>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", margin: "0 0 10px", textAlign: "right" }}>
            Follow us for updates
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  color: "rgba(255,255,255,0.82)",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  transition: "transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                <Icon size={16} />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}