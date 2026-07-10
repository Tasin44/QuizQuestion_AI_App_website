"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../_components/useLanguage";

const categories = [
  { name: "Math", path: "math" },
  { name: "Statistics", path: "statistics" },
  { name: "Calculus", path: "calculus" },
  { name: "Physics", path: "physics" },
  { name: "Chemistry", path: "chemistry" },
  { name: "Biology", path: "biology" },
  { name: "Economics", path: "economics" },
  { name: "Literature", path: "literature" },
  { name: "Business", path: "business" },
  { name: "Writing", path: "writing" },
];

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <div className="resources-container">
      <style>{`
        .resources-container {
          display: flex;
          flex-direction: row;
          min-height: 100vh;
        }
        .resources-sidebar {
          width: 200px;
          border-right: 1px solid rgba(255,255,255,0.06);
          padding: 20px 0;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }
        .resources-link {
          display: block;
          width: 100%;
          padding: 12px 24px;
          border-left: 3px solid transparent;
          font-size: 14px;
          text-align: left;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .resources-link-active {
          background: rgba(79,70,229,0.12);
          border-left: 3px solid #4F46E5;
          color: #ffffff;
          font-weight: 600;
        }
        .resources-link-inactive {
          color: rgba(255,255,255,0.5);
          font-weight: 400;
        }
        .resources-content {
          flex: 1;
        }

        @media (max-width: 768px) {
          .resources-container {
            flex-direction: column;
            min-height: auto;
          }
          .resources-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding: 10px 16px;
            flex-direction: row;
            overflow-x: auto;
            white-space: nowrap;
            gap: 8px;
            scrollbar-width: none; /* Hide scrollbar Firefox */
          }
          .resources-sidebar::-webkit-scrollbar {
            display: none; /* Hide scrollbar Chrome/Safari */
          }
          .resources-link {
            display: inline-block;
            width: auto;
            padding: 8px 16px;
            border-left: none;
            border-radius: 20px;
            font-size: 13px;
            text-align: center;
          }
          .resources-link-active {
            background: rgba(79,70,229,0.15) !important;
            border-left: none !important;
            color: #7b68ee !important;
            font-weight: 600;
          }
        }
      `}</style>

      {/* Category Sidebar */}
      <div className="resources-sidebar">
        {categories.map((cat) => {
          const catPath = `/dashboard/resources/${cat.path}`;
          // Make "math" active if we are on the base page
          const isActive = pathname === catPath || (pathname === "/dashboard/resources" && cat.path === "math");
          return (
            <Link
              key={cat.path}
              href={catPath}
              className={`resources-link ${isActive ? "resources-link-active" : "resources-link-inactive"}`}
            >
              {t(cat.name)}
            </Link>
          );
        })}
      </div>
      <div className="resources-content">{children}</div>
    </div>
  );
}
