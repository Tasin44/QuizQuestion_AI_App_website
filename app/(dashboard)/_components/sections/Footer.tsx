"use client";
import Link from "next/link";

const footerLinks = {
  Product: ["Features", "Pricing", "AI Models", "Mobile App"],
  Resources: ["Help Center", "Blog", "Tutorials", "API Docs"],
  Company: ["About Us", "Careers", "Contact", "Privacy Policy", "Terms of Service"],
};

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        backgroundColor: "#0A0A0F",
        padding: "50px 40px 30px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
                {links.map((link) => {
                  let href = "#";
                  if (link === "Privacy Policy") href = "/dashboard/privacy-policy";
                  else if (link === "Terms of Service") href = "/dashboard/term-of-service";

                  return (
                    <Link
                      key={link}
                      href={href}
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
                  );
                })}
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
          <div style={{ display: "flex", gap: "20px" }}>
            {[
              <svg key="x" width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.35)">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>,
              <svg key="gh" width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.35)">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>,
              <svg key="dc" width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.35)">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561 19.9187 19.9187 0 005.9933 3.0294.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286 19.8674 19.8674 0 006.0019-3.0294.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
              </svg>,
            ].map((icon, i) => (
              <span
                key={i}
                style={{ cursor: "pointer", transition: "opacity 0.2s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                {icon}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}