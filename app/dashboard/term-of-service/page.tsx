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

export default function TermOfServicePage() {
  const router = useRouter();

  return (
    <div style={{ padding: "40px 60px", maxWidth: "900px", width: "100%", boxSizing: "border-box" as const }}>
      {/* Title */}
      <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: 700, margin: "0 0 8px" }}>Terms of Use</h1>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", lineHeight: 1.6, margin: "0 0 4px", maxWidth: "720px" }}>
        Quiz Question AI — Terms of Use
      </p>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: "0 0 28px" }}>Effective Date: May 22, 2026</p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "36px" }}>
        <button onClick={() => router.push("/dashboard/help-center")} style={inactiveTab}>Help Center</button>
        <button onClick={() => router.push("/dashboard/privacy-policy")} style={inactiveTab}>Privacy Policy</button>
        <button style={activeTab}>Terms of Use</button>
      </div>

      {/* 1 */}
      <SectionTitle>1. Introduction and Legal Agreement</SectionTitle>
      <P>Welcome to Quiz Question AI.</P>
      <P>These Terms of Use (&quot;Terms&quot;) govern your access to and use of the Quiz Question AI platform, mobile applications, websites, APIs, software systems, educational technologies, artificial intelligence tools, and related services (collectively, the &quot;Platform&quot; or &quot;Services&quot;) operated by Quiz Question AI LLC (&quot;Quiz Question AI,&quot; &quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;).</P>
      <P>By accessing, downloading, installing, browsing, creating an account, subscribing to, or otherwise using the Services, you acknowledge that you have read, understood, and agreed to be legally bound by these Terms and all applicable United States federal, state, and local laws and regulations.</P>
      <P>If you do not agree with these Terms, you must immediately stop using the Services.</P>
      <P>These Terms form a legally binding agreement between you and Quiz Question AI LLC without requiring handwritten or electronic signatures.</P>

      {/* 2 */}
      <SectionTitle>2. Eligibility, Age Restrictions, and Parental Controls</SectionTitle>
      <P>Quiz Question AI is designed primarily for individuals who are eighteen (18) years of age or older.</P>
      <P>By accessing or using the Services, you represent and warrant that:</P>
      <BulletList items={["You are at least eighteen (18) years old;", "You possess the legal authority to enter into binding agreements;", "You will comply with all applicable laws and regulations;", "All information submitted to the Company is truthful, accurate, and current."]} />
      <h3 style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: 600, margin: "20px 0 8px" }}>Minor Users and Parental Oversight</h3>
      <P>Users under the age of eighteen (18) may only access Quiz Question AI through authorized parental supervision and parental control systems provided or approved by the Company.</P>
      <P>Parents and legal guardians acknowledge and agree that they are solely responsible for:</P>
      <BulletList items={["Supervising a minor's access and activities;", "Reviewing prompts, AI outputs, and interactions;", "Monitoring educational and behavioral use;", "Preventing misuse of AI-generated information;", "Managing account restrictions and safety settings;", "Determining whether the Services are appropriate for the child."]} />
      <P>Quiz Question AI reserves the right to restrict, suspend, or permanently terminate accounts suspected of unauthorized underage usage or violations of child safety protections.</P>

      {/* 3 */}
      <SectionTitle>3. Privacy and Data Usage</SectionTitle>
      <P>Quiz Question AI values user privacy and data protection.</P>
      <P>By using the Services, you consent to the collection, storage, processing, transfer, and use of information in accordance with our Privacy Policy and applicable United States privacy laws.</P>
      <P>Information collected may include:</P>
      <BulletList items={["Account registration information;", "Uploaded files, images, and documents;", "User prompts and AI conversations;", "Device identifiers and browser data;", "Usage analytics and system logs;", "Subscription and payment information;", "IP addresses and security monitoring data."]} />
      <P>We may utilize third-party providers, including:</P>
      <BulletList items={["AI model providers;", "Cloud hosting providers;", "Analytics services;", "Authentication systems;", "Payment processors;", "Infrastructure and security vendors."]} />
      <P>You acknowledge that no online transmission or storage method is completely secure, and Quiz Question AI cannot guarantee absolute security of information transmitted through the Internet.</P>

      {/* 4 */}
      <SectionTitle>4. Description of Services</SectionTitle>
      <P>Quiz Question AI offers AI-powered educational, productivity, and informational technologies, including but not limited to:</P>
      <BulletList items={["AI-generated question answering;", "Quiz creation and academic support;", "Study assistance and tutoring;", 'OCR scanning and "scan-and-solve" technologies;', "AI chatbot systems;", "Prompt-based educational tools;", "Multi-model AI integrations;", "Educational content generation;", "Research and productivity assistance."]} />
      <P>The Services may evolve, expand, or change over time without notice. Quiz Question AI reserves the right to modify, suspend, discontinue, or update any feature, function, or portion of the Services at any time.</P>

      {/* 5 */}
      <SectionTitle>5. Third-Party AI Systems and External Technologies</SectionTitle>
      <P>Quiz Question AI integrates and relies on third-party artificial intelligence systems, APIs, machine learning technologies, cloud providers, and external infrastructure services.</P>
      <P>Because these technologies are operated independently:</P>
      <BulletList items={["We do not control all AI-generated outputs;", "AI responses may contain inaccuracies, hallucinations, incomplete information, bias, or offensive content;", "External AI systems may experience outages, interruptions, or service limitations;", "Third-party providers may alter or discontinue services at any time without notice."]} />
      <P>You acknowledge and agree that:</P>
      <BulletList items={["AI-generated information is not guaranteed to be accurate or reliable;", "Outputs should not be interpreted as legal, financial, medical, educational, psychological, or professional advice;", "Users must independently verify information before relying upon it;", "Quiz Question AI LLC is not responsible for decisions made based on AI-generated outputs."]} />
      <P>You are strongly advised to consult licensed professionals before making important decisions based on AI-generated information.</P>

      {/* 6 */}
      <SectionTitle>6. Account Registration and Security</SectionTitle>
      <P>Certain features of the Services may require user registration. Users may create accounts using approved authentication methods, including:</P>
      <BulletList items={["Email registration;", "Google authentication;", "Apple authentication;", "Other authorized sign-in providers."]} />
      <P>You agree to:</P>
      <BulletList items={["Maintain accurate and updated account information;", "Protect account credentials and passwords;", "Notify us immediately of unauthorized access;", "Accept responsibility for all activities occurring under your account."]} />
      <P>Quiz Question AI reserves the right to suspend, restrict, investigate, or terminate accounts involved in:</P>
      <BulletList items={["Fraudulent activity;", "Unauthorized access attempts;", "Violations of these Terms;", "Illegal conduct;", "Platform abuse;", "Harmful automation or scraping;", "Security threats or suspicious behavior."]} />

      {/* 7 */}
      <SectionTitle>7. Acceptable Use Policy</SectionTitle>
      <P>You agree not to use the Services to:</P>
      <BulletList items={["Violate any law, regulation, or court order;", "Infringe copyrights, trademarks, or intellectual property rights;", "Upload viruses, malware, or harmful software;", "Harass, threaten, exploit, or abuse others;", "Generate unlawful, deceptive, or fraudulent content;", "Circumvent security protections or access controls;", "Reverse engineer or copy the platform;", "Engage in unauthorized scraping or automated extraction;", "Upload harmful, obscene, or inappropriate materials;", "Distribute misleading or dangerous AI-generated information;", "Interfere with platform operations or network integrity."]} />
      <P>Quiz Question AI may investigate violations and cooperate with law enforcement authorities where legally required.</P>

      {/* 8 */}
      <SectionTitle>8. Subscription Plans, Billing, and Payments</SectionTitle>
      <P>Certain features and Services may require payment, subscription enrollment, or in-app purchases.</P>
      <P>By purchasing paid Services, you acknowledge and agree that:</P>
      <BulletList items={["Prices are listed in U.S. Dollars unless otherwise stated;", "Subscription plans may renew automatically;", "You authorize recurring billing until cancellation;", "Payments are processed through authorized third-party payment providers;", "Taxes and applicable fees may apply;", "All purchases are final except where required by law."]} />
      <P>You may cancel subscriptions through your account settings or the applicable app marketplace provider.</P>
      <P>Quiz Question AI reserves the right to:</P>
      <BulletList items={["Change pricing structures;", "Modify subscription plans;", "Add or remove paid features;", "Limit promotional offers;", "Suspend or discontinue paid Services."]} />

      {/* 9 */}
      <SectionTitle>9. Ownership of Intellectual Property</SectionTitle>
      <P>All rights, title, and interests in the Services and related technologies remain the exclusive property of Quiz Question AI LLC or its licensors.</P>
      <P>Protected materials include, but are not limited to:</P>
      <BulletList items={["Software and source code;", "AI systems and algorithms;", "Trademarks and branding;", "Logos and graphics;", "Databases and interfaces;", "Educational technologies;", "Website designs and content architecture;", "Proprietary systems and infrastructure."]} />
      <P>Except as expressly authorized in writing, users may not:</P>
      <BulletList items={["Copy or reproduce content;", "Reverse engineer systems;", "Modify or distribute materials;", "Commercialize platform technologies;", "Create derivative works;", "Resell or sublicense Services."]} />
      <P>Unauthorized use may violate United States intellectual property laws and subject violators to civil or criminal penalties.</P>

      {/* 10 */}
      <SectionTitle>10. AI-Generated Content and Accuracy Disclaimer</SectionTitle>
      <P>Quiz Question AI utilizes automated artificial intelligence systems that generate responses algorithmically.</P>
      <P>AI-generated outputs may contain:</P>
      <BulletList items={["Inaccuracies;", "Hallucinations;", "Outdated information;", "Incomplete answers;", "Biased or inappropriate content."]} />
      <P>Quiz Question AI does not warrant or guarantee:</P>
      <BulletList items={["Accuracy;", "Reliability;", "Educational correctness;", "Legal compliance;", "Professional suitability;", "Completeness or timeliness."]} />
      <P>Users understand and agree that:</P>
      <BulletList items={["AI outputs are for informational and educational purposes only;", "AI systems should not replace licensed professionals or expert advice;", "Users assume all risks associated with reliance on AI-generated information."]} />
      <P>Always seek advice from qualified legal, medical, financial, educational, or professional advisors before making decisions based on AI-generated responses.</P>

      {/* 11 */}
      <SectionTitle>11. Copyright and DMCA Compliance</SectionTitle>
      <P>Users may upload only content they legally own or are authorized to use.</P>
      <P>You represent and warrant that submitted content does not infringe:</P>
      <BulletList items={["Copyrights;", "Trademarks;", "Privacy rights;", "Proprietary rights;", "Intellectual property rights;", "Confidentiality obligations."]} />
      <P>Quiz Question AI complies with the United States Digital Millennium Copyright Act (&quot;DMCA&quot;). If you believe your copyrighted work has been improperly used through the Services, you may submit a valid DMCA takedown notice containing all legally required information.</P>
      <P>We reserve the right to remove allegedly infringing materials and terminate repeat infringers.</P>

      {/* 12 */}
      <SectionTitle>12. Service Changes, Suspension, and Termination</SectionTitle>
      <P>Quiz Question AI reserves the right, at its sole discretion and to the fullest extent permitted by law, to:</P>
      <BulletList items={["Modify or discontinue Services;", "Restrict platform functionality;", "Remove user content;", "Suspend accounts;", "Terminate access rights;", "Update these Terms at any time."]} />
      <P>Continued use of the Services following modifications constitutes acceptance of the revised Terms. Users are responsible for reviewing updated Terms periodically.</P>

      {/* 13 */}
      <SectionTitle>13. Disclaimer of Warranties</SectionTitle>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "16px 20px", margin: "8px 0 12px" }}>
        <P>THE SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS.</P>
        <P>TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, QUIZ QUESTION AI LLC DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING WARRANTIES OF:</P>
        <BulletList items={["MERCHANTABILITY;", "FITNESS FOR A PARTICULAR PURPOSE;", "NON-INFRINGEMENT;", "ACCURACY;", "RELIABILITY;", "SECURITY;", "SYSTEM AVAILABILITY."]} />
        <P>WE DO NOT GUARANTEE THAT:</P>
        <BulletList items={["THE SERVICES WILL OPERATE WITHOUT INTERRUPTION;", "THE PLATFORM WILL BE ERROR-FREE;", "AI OUTPUTS WILL BE ACCURATE OR SAFE;", "SECURITY BREACHES WILL NOT OCCUR;", "DEFECTS WILL BE CORRECTED."]} />
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.75, margin: 0, fontWeight: 600 }}>YOUR USE OF THE SERVICES IS ENTIRELY AT YOUR OWN RISK.</p>
      </div>

      {/* 14 */}
      <SectionTitle>14. Limitation of Liability</SectionTitle>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "16px 20px", margin: "8px 0 12px" }}>
        <P>TO THE FULLEST EXTENT PERMITTED UNDER UNITED STATES LAW, QUIZ QUESTION AI LLC AND ITS AFFILIATES SHALL NOT BE LIABLE FOR:</P>
        <BulletList items={["INDIRECT DAMAGES;", "INCIDENTAL DAMAGES;", "SPECIAL DAMAGES;", "CONSEQUENTIAL DAMAGES;", "LOSS OF PROFITS;", "LOSS OF DATA;", "BUSINESS INTERRUPTION;", "REPUTATIONAL HARM;", "PERSONAL DECISIONS BASED ON AI OUTPUTS;", "THIRD-PARTY SYSTEM FAILURES;", "DAMAGES ARISING FROM AI-GENERATED CONTENT."]} />
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.75, margin: 0 }}>IN NO EVENT SHALL THE TOTAL LIABILITY OF QUIZ QUESTION AI LLC EXCEED THE TOTAL AMOUNT PAID BY YOU TO THE COMPANY DURING THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.</p>
      </div>

      {/* 15 */}
      <SectionTitle>15. User Responsibility and Indemnification</SectionTitle>
      <P>You agree to defend, indemnify, and hold harmless Quiz Question AI LLC and its officers, directors, employees, affiliates, contractors, licensors, and service providers from and against any claims, liabilities, damages, losses, costs, expenses, or legal fees arising from:</P>
      <BulletList items={["Your use of the Services;", "Violations of these Terms;", "Violations of applicable laws;", "Infringement of third-party rights;", "Misuse of AI-generated content;", "User-uploaded materials or prompts."]} />
      <P>This indemnification obligation survives termination of your account and use of the Services.</P>

      {/* 16 */}
      <SectionTitle>16. Governing Law and Arbitration</SectionTitle>
      <P>These Terms shall be governed by and interpreted in accordance with the laws of the State of Maryland and the United States of America, without regard to conflict-of-law principles.</P>
      <P>Any dispute, claim, or controversy arising out of or relating to these Terms or the Services shall be resolved exclusively through binding arbitration conducted in the State of Maryland, unless prohibited by applicable law.</P>
      <P>To the fullest extent permitted by law:</P>
      <BulletList items={["You waive the right to a jury trial;", "You waive participation in class-action lawsuits;", "You waive participation in class-wide arbitration proceedings."]} />

      {/* 17 */}
      <SectionTitle>17. Contact Details</SectionTitle>
      <P>For questions regarding these Terms or the Services, please contact:</P>
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
