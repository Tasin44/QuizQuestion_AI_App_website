"use client";
import { useRouter } from "next/navigation";

const privacyContent = [
  {
    heading: null,
    text: `At Website Name, accessible at Website.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Website Name and how we use it.`,
    highlight: true,
  },
  {
    heading: null,
    text: `If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through email at Email@Website.com`,
  },
  {
    heading: null,
    text: `This privacy policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Website Name. This policy is not applicable to any information collected offline or via channels other than this website.`,
  },
  {
    heading: "Consent",
    text: `By using our website, you hereby consent to our Privacy Policy and agree to its terms.`,
  },
  {
    heading: "Information we collect",
    text: `The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.`,
  },
  {
    heading: null,
    text: `If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.`,
  },
  {
    heading: null,
    text: `When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.`,
  },
  {
    heading: "How we use your information",
    text: `We use the information we collect in various ways, including to:`,
  },
  {
    heading: null,
    list: [
      "Provide, operate, and maintain our website",
      "Improve, personalize, and expand our website",
      "Understand and analyze how you use our website",
      "Develop new products, services, features, and functionality",
      "Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes",
    ],
  },
];

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div style={{ padding: "40px 60px", maxWidth: "900px", width: "100%", boxSizing: "border-box" }}>
      {/* Title */}
      <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: 700, margin: "0 0 12px" }}>Privacy policy</h1>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", lineHeight: 1.6, margin: "0 0 28px", maxWidth: "700px" }}>
        A privacy policy is a legal document where you disclose what data you collect from users, how you manage the collected data and how you use that data. The important objective of a privacy policy is to inform users how you collect, use and manage the collected.
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "32px" }}>
        <button style={{ padding: "10px 20px", background: "transparent", border: "none", borderBottom: "2px solid #7b68ee", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
          Privacy policy
        </button>
        <button onClick={() => router.push("/dashboard/term-of-service")} style={{ padding: "10px 20px", background: "transparent", border: "none", borderBottom: "2px solid transparent", color: "rgba(255,255,255,0.45)", fontSize: "14px", cursor: "pointer" }}>
          Term of Service
        </button>
      </div>

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {privacyContent.map((section, i) => (
          <div key={i} style={section.highlight ? { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "16px 20px" } : {}}>
            {section.heading && (
              <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: 600, margin: "0 0 8px" }}>{section.heading}</h3>
            )}
            {section.text && (
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.75, margin: 0 }}>{section.text}</p>
            )}
            {section.list && (
              <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {section.list.map((item, j) => (
                  <li key={j} style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.6 }}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
