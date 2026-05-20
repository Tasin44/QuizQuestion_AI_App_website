import Image from "next/image";

export default function AuthCard({ children }) {
  return (
    <main
      style={{ backgroundColor: "#0A0A0F" }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      {/* Logo */}
      <div className="mb-8">
        <img
          src="/images/ai-logo.png"
          alt="Quiz Question AI"
          width={180}
          height={50}
          className="object-contain"
        />
      </div>

      {/* Card */}
      <div
        style={{
          backgroundColor: "#111118",
          width: "420px",
          minHeight: "auto",
          gap: "30px",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        className="flex flex-col p-8"
      >
        {children}
      </div>
    </main>
  );
}