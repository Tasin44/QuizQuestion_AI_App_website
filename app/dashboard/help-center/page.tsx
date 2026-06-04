"use client";
import { useRouter } from "next/navigation";

/* ───── Shared tab styles ───── */
const activeTab: React.CSSProperties = { padding: "12px 22px", background: "transparent", border: "none", borderBottom: "2px solid #7b68ee", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "color 0.2s" };
const inactiveTab: React.CSSProperties = { padding: "12px 22px", background: "transparent", border: "none", borderBottom: "2px solid transparent", color: "rgba(255,255,255,0.45)", fontSize: "14px", cursor: "pointer", transition: "color 0.2s" };

/* ───── Section component ───── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "36px" }}>
      <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, margin: "0 0 16px", borderLeft: "3px solid #7b68ee", paddingLeft: "14px" }}>{title}</h2>
      {children}
    </div>
  );
}

function QA({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h3 style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: 600, margin: "0 0 8px" }}>{q}</h3>
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "8px 0 0", paddingLeft: "22px", display: "flex", flexDirection: "column", gap: "4px" }}>
      {items.map((item, i) => (
        <li key={i} style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.7 }}>{item}</li>
      ))}
    </ul>
  );
}

export default function HelpCenterPage() {
  const router = useRouter();

  return (
    <div style={{ padding: "40px 60px", maxWidth: "900px", width: "100%", boxSizing: "border-box" as const }}>
      {/* Title */}
      <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: 700, margin: "0 0 8px" }}>Help Center</h1>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", lineHeight: 1.6, margin: "0 0 28px", maxWidth: "720px" }}>
        Welcome to the official help center for Quiz Question AI. We are committed to helping students, educators, and learners get the best experience from our AI-powered academic assistant platform.
      </p>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: "0 0 28px" }}>
        For additional support, contact us anytime at: <a href="mailto:feedback@quizquestionai.com" style={{ color: "#7b68ee", textDecoration: "none" }}>feedback@quizquestionai.com</a>
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "36px" }}>
        <button style={activeTab}>Help Center</button>
        <button onClick={() => router.push("/dashboard/privacy-policy")} style={inactiveTab}>Privacy Policy</button>
        <button onClick={() => router.push("/dashboard/term-of-service")} style={inactiveTab}>Terms of Use</button>
      </div>

      {/* ═══════ Content ═══════ */}

      {/* General Questions */}
      <Section title="General Questions">
        <QA q="What is Quiz Question AI?">
          <p style={{ margin: "0 0 8px" }}>Quiz Question AI is an AI-powered educational assistant designed to help students solve homework problems, understand academic concepts, generate study materials, and improve learning across multiple subjects.</p>
          <p style={{ margin: "0 0 4px" }}>The platform supports subjects including:</p>
          <BulletList items={["Mathematics", "Science", "Physics", "Chemistry", "Biology", "Literature", "History", "Business Studies", "English Language", "Social Sciences", "And many more"]} />
          <p style={{ margin: "10px 0 0" }}>Students can ask questions using text, screenshots, images, scanned documents, or AI chat conversations.</p>
        </QA>

        <QA q="How does Quiz Question AI work?">
          <p style={{ margin: "0 0 6px" }}>Using Quiz Question AI is simple:</p>
          <ol style={{ margin: "0", paddingLeft: "22px", display: "flex", flexDirection: "column", gap: "4px" }}>
            <li style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.7 }}>Type your question directly into the platform.</li>
            <li style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.7 }}>Upload an image, screenshot, or document if needed.</li>
            <li style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.7 }}>Our AI system analyzes the question instantly.</li>
            <li style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.7 }}>Receive accurate answers, explanations, and learning guidance within seconds.</li>
          </ol>
          <p style={{ margin: "10px 0 0" }}>The platform is designed to provide both quick answers and deeper understanding.</p>
        </QA>

        <QA q="Is Quiz Question AI free to use?">
          <p style={{ margin: "0 0 6px" }}>Yes. Quiz Question AI offers free access to many features. Premium plans may include:</p>
          <BulletList items={["Unlimited AI questions", "Faster responses", "Advanced AI models", "Unlimited image uploads", "Extended document analysis", "Priority support", "Early access to new tools"]} />
        </QA>

        <QA q="Which devices are supported?">
          <p style={{ margin: "0 0 6px" }}>Quiz Question AI works across multiple devices and platforms, including:</p>
          <BulletList items={["Web browsers", "Android devices", "iPhone & iPad", "Tablets", "Desktop computers"]} />
        </QA>

        <QA q="Can I upload screenshots or photos of questions?">
          <p style={{ margin: "0 0 6px" }}>Yes. You can upload:</p>
          <BulletList items={["Homework screenshots", "Math equations", "PDF files", "Worksheets", "Handwritten notes", "Camera images"]} />
          <p style={{ margin: "10px 0 0" }}>Our AI can analyze and solve problems directly from uploaded images and documents.</p>
        </QA>
      </Section>

      {/* Academic Assistance */}
      <Section title="Academic Assistance">
        <QA q="Which subjects are supported?">
          <p style={{ margin: "0 0 6px" }}>Quiz Question AI supports a wide range of academic subjects including:</p>
          <BulletList items={["Algebra", "Geometry", "Calculus", "Chemistry", "Biology", "Physics", "Literature", "History", "Economics", "Business", "Computer Science", "Grammar & Writing", "Test Preparation"]} />
        </QA>

        <QA q="Does the platform provide step-by-step explanations?">
          <p style={{ margin: 0 }}>Yes. For many questions, Quiz Question AI provides detailed step-by-step solutions to help students understand the process, not just the final answer. This helps improve learning, comprehension, and academic confidence.</p>
        </QA>

        <QA q="Can Quiz Question AI help with essays and writing?">
          <p style={{ margin: "0 0 6px" }}>Yes. The platform can assist with:</p>
          <BulletList items={["Essay generation", "Grammar correction", "Writing improvement", "Content summarization", "Research support", "Citation guidance", "Paragraph rewriting", "Academic writing structure"]} />
          <p style={{ margin: "10px 0 0" }}>Students should always review and personalize generated content before submission.</p>
        </QA>

        <QA q="Can the AI summarize textbooks or long documents?">
          <p style={{ margin: "0 0 6px" }}>Yes. Quiz Question AI can summarize:</p>
          <BulletList items={["PDFs", "Articles", "Research documents", "Notes", "Textbooks", "Study materials"]} />
          <p style={{ margin: "10px 0 0" }}>This helps students study more efficiently and save time.</p>
        </QA>

        <QA q="Does Quiz Question AI support multiple languages?">
          <p style={{ margin: 0 }}>Yes. The platform supports multilingual learning and can assist users in many international languages.</p>
        </QA>
      </Section>

      {/* Account & Subscription */}
      <Section title="Account & Subscription">
        <QA q="Do I need an account to use the platform?">
          <p style={{ margin: "0 0 6px" }}>Some features may be available without registration, but creating an account allows users to:</p>
          <BulletList items={["Save chat history", "Access premium tools", "Sync across devices", "Store uploaded documents", "Personalize learning experiences"]} />
        </QA>

        <QA q="How do I reset my password?">
          <p style={{ margin: "0 0 6px" }}>Use the &quot;Forgot Password&quot; option on the login page and follow the instructions sent to your registered email address.</p>
          <p style={{ margin: 0 }}>If you still experience issues, contact: <a href="mailto:feedback@quizquestionai.com" style={{ color: "#7b68ee", textDecoration: "none" }}>feedback@quizquestionai.com</a></p>
        </QA>

        <QA q="How do I cancel my subscription?">
          <p style={{ margin: "0 0 6px" }}>You can manage or cancel your subscription through your account settings or through the platform where the subscription was purchased.</p>
          <p style={{ margin: 0 }}>After cancellation, premium access remains active until the end of the current billing cycle.</p>
        </QA>

        <QA q="Are payments secure?">
          <p style={{ margin: 0 }}>Yes. Quiz Question AI uses secure payment technologies and encrypted systems to help protect user transactions and account information.</p>
        </QA>
      </Section>

      {/* Privacy & Security */}
      <Section title="Privacy & Security">
        <QA q="Is my personal information safe?">
          <p style={{ margin: 0 }}>Protecting user privacy is important to us. We use industry-standard security practices to help safeguard personal information and uploaded content.</p>
        </QA>

        <QA q="Are uploaded files stored permanently?">
          <p style={{ margin: 0 }}>Uploaded files may be temporarily processed to improve user experience and AI functionality. Users may delete content from their accounts where supported.</p>
        </QA>

        <QA q="Does Quiz Question AI sell user data?">
          <p style={{ margin: 0 }}>No. We do not sell personal user information to third parties.</p>
        </QA>
      </Section>

      {/* Technical Support */}
      <Section title="Technical Support">
        <QA q="Why is my upload not working?">
          <p style={{ margin: "0 0 6px" }}>Common reasons include:</p>
          <BulletList items={["Unsupported file format", "Large file size", "Weak internet connection", "Temporary server issues"]} />
          <p style={{ margin: "10px 0 0" }}>Try refreshing the page or uploading the file again.</p>
        </QA>

        <QA q="Why am I not receiving answers?">
          <p style={{ margin: "0 0 6px" }}>Possible reasons may include:</p>
          <BulletList items={["Network interruptions", "Temporary platform maintenance", "Unsupported question format", "High server traffic"]} />
          <p style={{ margin: "10px 0 0" }}>Please retry after a few moments.</p>
        </QA>

        <QA q="How can I report bugs or technical problems?">
          <p style={{ margin: "0 0 6px" }}>If you encounter any technical issues, errors, or unexpected behavior, please contact our support team:</p>
          <p style={{ margin: "0 0 8px" }}><a href="mailto:feedback@quizquestionai.com" style={{ color: "#7b68ee", textDecoration: "none" }}>feedback@quizquestionai.com</a></p>
          <p style={{ margin: "0 0 4px" }}>Include:</p>
          <BulletList items={["A description of the issue", "Screenshots if available", "Your device/browser information", "Steps to reproduce the problem"]} />
        </QA>
      </Section>

      {/* Educational Responsibility */}
      <Section title="Educational Responsibility">
        <QA q="Should students rely entirely on AI-generated answers?">
          <p style={{ margin: 0 }}>Quiz Question AI is designed to support learning and understanding. Students are encouraged to review explanations carefully and use the platform as an educational aid rather than a replacement for independent study.</p>
        </QA>
      </Section>

      {/* Contact & Community */}
      <Section title="Contact & Community">
        <QA q="How can I contact Quiz Question AI?">
          <p style={{ margin: "0 0 8px" }}><strong style={{ color: "#e2e8f0" }}>Official Website:</strong>{" "}
            <a href="https://quizquestionai.com" target="_blank" rel="noreferrer" style={{ color: "#7b68ee", textDecoration: "none" }}>Quiz Question AI Official Website</a>
          </p>
          <p style={{ margin: 0 }}><strong style={{ color: "#e2e8f0" }}>Support Email:</strong>{" "}
            <a href="mailto:feedback@quizquestionai.com" style={{ color: "#7b68ee", textDecoration: "none" }}>feedback@quizquestionai.com</a>
          </p>
        </QA>
      </Section>
    </div>
  );
}
