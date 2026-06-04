"use client";
import { useRouter } from "next/navigation";

/* ───── Shared tab styles ───── */
const activeTab: React.CSSProperties = { padding: "12px 22px", background: "transparent", border: "none", borderBottom: "2px solid #7b68ee", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "color 0.2s" };
const inactiveTab: React.CSSProperties = { padding: "12px 22px", background: "transparent", border: "none", borderBottom: "2px solid transparent", color: "rgba(255,255,255,0.45)", fontSize: "14px", cursor: "pointer", transition: "color 0.2s" };

/* ───── Helpers ───── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, margin: "40px 0 16px", borderLeft: "3px solid #7b68ee", paddingLeft: "14px" }}>{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.75, margin: "0 0 12px" }}>{children}</p>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "8px 0 12px", paddingLeft: "22px", display: "flex", flexDirection: "column", gap: "4px" }}>
      {items.map((item, i) => (
        <li key={i} style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.7 }}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div style={{ padding: "40px 60px", maxWidth: "900px", width: "100%", boxSizing: "border-box" as const }}>
      {/* Title */}
      <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: 700, margin: "0 0 8px" }}>Privacy Policy</h1>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", lineHeight: 1.6, margin: "0 0 4px", maxWidth: "720px" }}>
        Quiz Question AI — Privacy Policy
      </p>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: "0 0 28px" }}>Effective Date: May 22, 2026</p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "36px" }}>
        <button onClick={() => router.push("/dashboard/help-center")} style={inactiveTab}>Help Center</button>
        <button style={activeTab}>Privacy Policy</button>
        <button onClick={() => router.push("/dashboard/term-of-service")} style={inactiveTab}>Terms of Use</button>
      </div>

      {/* Intro */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "18px 22px", marginBottom: "28px" }}>
        <P>This Privacy Policy (&quot;Policy&quot;) applies to Quiz Question AI, an artificial intelligence-powered educational and learning platform, including all related websites, applications, software, AI tools, content, features, prompts, APIs, and services (collectively, the &quot;Services&quot;) operated by Quiz Question AI LLC (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;).</P>
        <P>This Policy explains how we collect, use, store, process, disclose, and protect personal information when users access or use Quiz Question AI and related Services.</P>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.75, margin: 0 }}>By accessing or using Quiz Question AI, you acknowledge that you have read, understood, and agreed to this Privacy Policy and our Terms of Use.</p>
      </div>

      {/* 1 */}
      <SectionTitle>1. Eligibility, Age Requirements &amp; Parental Control</SectionTitle>
      <P>Quiz Question AI is intended for users who are at least eighteen (18) years of age or older. Users under the age of 18 may only use Quiz Question AI under the direct supervision, monitoring, and consent of a parent or legal guardian through our parental control and safety framework.</P>
      <P>Parents and guardians are solely responsible for:</P>
      <BulletList items={["supervising underage users;", "monitoring AI-generated responses and prompts;", "controlling account activity;", "reviewing educational content;", "restricting inappropriate usage; and", "ensuring compliance with applicable laws."]} />
      <P>We reserve the right to restrict, suspend, or terminate accounts used by minors without proper parental authorization.</P>
      <P>We comply with applicable United States child privacy laws, including the Children&apos;s Online Privacy Protection Act (&quot;COPPA&quot;), where applicable. We do not knowingly collect personal information from children without verifiable parental consent where required by law.</P>
      <P>Parents or legal guardians may request:</P>
      <BulletList items={["access to a child's information;", "deletion of child-related data;", "account restrictions; or", "termination of a minor's account."]} />
      <P>Requests may be submitted to: <a href="mailto:info@quizquestionai.com" style={{ color: "#7b68ee", textDecoration: "none" }}>info@quizquestionai.com</a></P>

      {/* 2 */}
      <SectionTitle>2. Important AI &amp; Legal Disclaimer</SectionTitle>
      <P>Quiz Question AI utilizes artificial intelligence systems, machine learning technologies, and third-party API models provided by external technology providers.</P>
      <P>AI-generated responses, prompts, recommendations, educational materials, summaries, or outputs may:</P>
      <BulletList items={["contain inaccuracies;", "be incomplete or outdated;", "contain errors or hallucinations;", "not constitute professional advice; and", "not always reflect current legal, medical, financial, academic, or factual standards."]} />
      <P>Users acknowledge and agree that:</P>
      <BulletList items={['all AI-generated content is provided "AS IS" and "AS AVAILABLE";', "reliance on AI-generated content is solely at the user's own risk;", "Quiz Question AI LLC does not guarantee the accuracy, completeness, legality, reliability, or suitability of AI outputs;", "users should independently verify all information before making educational, legal, financial, medical, business, or personal decisions."]} />
      <P>Quiz Question AI LLC is not a law firm, medical provider, financial advisor, educational institution, or licensed professional service provider. Users are strongly advised to consult qualified professionals before relying on AI-generated information.</P>

      {/* 3 */}
      <SectionTitle>3. Information We Collect</SectionTitle>
      <h3 style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: 600, margin: "16px 0 8px" }}>3.1 Personal Information You Provide</h3>
      <BulletList items={["name;", "email address;", "username;", "profile information;", "uploaded images;", "text prompts;", "educational materials;", "PDF files;", "customer support communications;", "payment confirmations;", "subscription records."]} />
      <h3 style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: 600, margin: "16px 0 8px" }}>3.2 Automatically Collected Information</h3>
      <BulletList items={["IP address;", "browser type;", "device identifiers;", "operating system;", "app usage statistics;", "log files;", "device performance data;", "cookies and analytics data."]} />
      <h3 style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: 600, margin: "16px 0 8px" }}>3.3 AI Prompt &amp; Uploaded Content</h3>
      <P>When users submit prompts, upload files, or use AI features, submitted content may be processed by:</P>
      <BulletList items={["Quiz Question AI systems;", "third-party AI API providers;", "cloud hosting providers; and", "infrastructure partners."]} />
      <P>Users should not upload:</P>
      <BulletList items={["confidential legal documents;", "highly sensitive financial data;", "medical records;", "passwords;", "government identification documents; or", "protected confidential information."]} />

      {/* 4 */}
      <SectionTitle>4. How We Use Information</SectionTitle>
      <P>We may use collected information to:</P>
      <BulletList items={["provide and improve Services;", "personalize user experiences;", "process payments and subscriptions;", "maintain platform security;", "detect fraud and abuse;", "improve AI functionality;", "provide customer support;", "enforce legal rights and policies;", "comply with legal obligations;", "analyze system performance;", "protect users and the Company."]} />

      {/* 5 */}
      <SectionTitle>5. Third-Party Services &amp; AI Providers</SectionTitle>
      <P>Quiz Question AI may integrate with third-party technologies, including:</P>
      <BulletList items={["AI API providers;", "cloud hosting platforms;", "payment processors;", "analytics services;", "authentication providers;", "customer support systems."]} />
      <P>Third-party providers may independently collect and process information subject to their own privacy policies and terms.</P>
      <P>Quiz Question AI LLC is not responsible for:</P>
      <BulletList items={["third-party platform errors;", "AI hallucinations;", "outages;", "unauthorized third-party conduct;", "data transmission interruptions; or", "external platform privacy practices."]} />
      <P>Use of third-party integrations is at the user&apos;s own risk.</P>

      {/* 6 */}
      <SectionTitle>6. Payments &amp; Subscriptions</SectionTitle>
      <P>Certain Services may require paid subscriptions or purchases. Payments may be processed through authorized third-party payment providers, including:</P>
      <BulletList items={["Stripe;", "Apple Pay;", "Google Pay;", "debit cards;", "credit cards."]} />
      <P>We do not store full payment card numbers on our servers. Users agree that subscription purchases may renew automatically unless canceled in accordance with applicable billing terms.</P>

      {/* 7 */}
      <SectionTitle>7. Cookies &amp; Tracking Technologies</SectionTitle>
      <P>We may use cookies, analytics tools, and similar technologies to:</P>
      <BulletList items={["improve functionality;", "remember user preferences;", "analyze traffic;", "maintain security;", "optimize performance."]} />
      <P>Users may disable cookies through browser settings, though some features may not function properly.</P>

      {/* 8 */}
      <SectionTitle>8. Data Sharing &amp; Disclosure</SectionTitle>
      <P>We may share information:</P>
      <BulletList items={["with service providers;", "with AI technology providers;", "with payment processors;", "with legal authorities when required by law;", "during mergers, acquisitions, or business restructuring;", "to protect legal rights, users, or platform security."]} />
      <P>We do not sell personal information in violation of applicable U.S. privacy laws.</P>

      {/* 9 */}
      <SectionTitle>9. Data Security</SectionTitle>
      <P>We implement commercially reasonable administrative, technical, and physical safeguards designed to protect user information.</P>
      <P>However, no online platform, cloud system, AI platform, transmission method, or electronic storage system is completely secure. Users acknowledge and accept all cybersecurity and internet-related risks associated with online services.</P>
      <P>Quiz Question AI LLC disclaims liability for:</P>
      <BulletList items={["hacking;", "unauthorized access;", "cyberattacks;", "system failures;", "data breaches beyond reasonable control;", "internet interruptions; or", "force majeure events."]} />

      {/* 10 */}
      <SectionTitle>10. Data Retention</SectionTitle>
      <P>We retain information only for as long as reasonably necessary to:</P>
      <BulletList items={["operate Services;", "comply with legal obligations;", "resolve disputes;", "enforce agreements;", "maintain security and business operations."]} />
      <P>We may retain anonymized or aggregated data indefinitely for analytics, research, AI improvement, and lawful business purposes.</P>

      {/* 11 */}
      <SectionTitle>11. User Rights</SectionTitle>
      <P>Subject to applicable U.S. laws, users may request:</P>
      <BulletList items={["access to personal information;", "correction of inaccurate information;", "deletion of eligible information;", "withdrawal of certain consents;", "account termination."]} />
      <P>We may deny requests where permitted by law, including:</P>
      <BulletList items={["security concerns;", "fraud prevention;", "legal compliance obligations;", "unresolved disputes;", "protection of Company rights."]} />

      {/* 12 */}
      <SectionTitle>12. Account Termination</SectionTitle>
      <P>We reserve the right, at our sole discretion, to suspend, restrict, or terminate any account for:</P>
      <BulletList items={["misuse of Services;", "unlawful conduct;", "harmful prompts;", "abusive behavior;", "policy violations;", "suspected fraud;", "security risks;", "unauthorized automated usage."]} />
      <P>Termination decisions may be made without prior notice.</P>

      {/* 13 */}
      <SectionTitle>13. Limitation of Liability</SectionTitle>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "16px 20px", margin: "8px 0 12px" }}>
        <P>TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW: QUIZ QUESTION AI LLC DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, AND NON-INFRINGEMENT.</P>
        <P>QUIZ QUESTION AI LLC SHALL NOT BE LIABLE FOR:</P>
        <BulletList items={["AI-GENERATED ERRORS;", "USER RELIANCE ON AI OUTPUTS;", "EDUCATIONAL OUTCOMES;", "BUSINESS DECISIONS;", "LEGAL OR FINANCIAL LOSSES;", "DATA LOSS;", "INDIRECT DAMAGES;", "CONSEQUENTIAL DAMAGES;", "LOST PROFITS;", "SERVICE INTERRUPTIONS."]} />
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.75, margin: 0, fontWeight: 600 }}>USE OF QUIZ QUESTION AI IS ENTIRELY AT THE USER&apos;S OWN RISK.</p>
      </div>

      {/* 14 */}
      <SectionTitle>14. International Users</SectionTitle>
      <P>Users accessing Services outside the United States acknowledge that their information may be transferred to and processed within the United States or other jurisdictions where our providers operate.</P>

      {/* 15 */}
      <SectionTitle>15. Changes to This Policy</SectionTitle>
      <P>We reserve the right to update or modify this Privacy Policy at any time without prior notice. Updated versions become effective immediately upon posting.</P>
      <P>Continued use of Quiz Question AI after updates constitutes acceptance of revised terms.</P>

      {/* 16 */}
      <SectionTitle>16. Contact Information</SectionTitle>
      <P>If you have questions regarding this Privacy Policy or user privacy matters, please contact:</P>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "16px 22px", marginTop: "8px" }}>
        <p style={{ color: "#e2e8f0", fontSize: "14px", lineHeight: 1.8, margin: 0 }}>
          <strong>Quiz Question AI LLC</strong><br />
          1177 Annapolis Rd, Unit 91<br />
          Odenton, MD 21113<br />
          United States<br />
          Email: <a href="mailto:info@quizquestionai.com" style={{ color: "#7b68ee", textDecoration: "none" }}>info@quizquestionai.com</a>
        </p>
      </div>
    </div>
  );
}
