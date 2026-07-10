"use client";
import Link from "next/link";
import { AiFillTikTok } from "react-icons/ai";
import { FaFacebook, FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useLanguage } from "../useLanguage";

const footerLinks = {
  Company: ["Careers", "Privacy Policy"],
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
  const { t } = useLanguage();
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "50px 20px 30px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <style>{`
        .footer-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          gap: 30px;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }
        .footer-social-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        @media (max-width: 640px) {
          .footer-top {
            flex-direction: column;
            gap: 30px;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .footer-social-row {
            justify-content: flex-start;
          }
          .footer-follow-text {
            text-align: left !important;
          }
        }
      `}</style>
      <div className="footer-top">
        {/* Logo & Tagline */}
        <div style={{ maxWidth: "280px" }}>
          <img
            src="/images/ai-logo.png"
            alt="Quiz Question AI"
            style={{ height: "38px", objectFit: "contain", marginBottom: "14px" }}
          />
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
            {t("Your AI-powered homework companion. Get instant help with any subject, anytime.")}
          </p>
        </div>

        {/* Link Columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 style={{ color: "#ffffff", fontSize: "14px", fontWeight: 600, margin: "0 0 16px" }}>
              {t(title)}
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
                  {t(link)}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", margin: 0 }}>
          {t("© 2026 Quiz Question AI. All rights reserved.")}
        </p>
        <div>
          <p className="footer-follow-text" style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", margin: "0 0 10px", textAlign: "right" }}>
            {t("Follow us for updates")}
          </p>
          <div className="footer-social-row">
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