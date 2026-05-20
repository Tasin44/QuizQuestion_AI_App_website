"use client";
import { useRouter } from "next/navigation";

const termsContent = [
  {
    text: `These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and [business entity name] ("we," "us" or "our"), concerning your access to and use of the [website name] website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").`,
    highlight: true,
  },
  {
    text: `You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly prohibited from using the Site and you must discontinue use immediately.`,
  },
  {
    text: `Supplemental terms and conditions or documents that may be posted on the Site from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Terms and Conditions at any time and for any reason.`,
  },
  {
    text: `We will alert you about any changes by updating the “Last updated” date of these Terms and Conditions, and you waive any right to receive specific notice of each such change.`,
  },
  {
    text: `It is your responsibility to periodically review these Terms and Conditions to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Terms and Conditions by your continued use of the Site after the date such revised Terms and Conditions are posted.`,
  },
  {
    text: `The information provided on the Site is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country.`,
  },
  {
    text: `Accordingly, those persons who choose to access the Site from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.`,
  },
  {
    text: `These terms and conditions were created by Termly's Terms and Conditions Generator.`,
  },
  {
    text: `Option 1: The Site is intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to register for the Site.`,
  },
  {
    text: `Option 2: [The Site is intended for users who are at least 13 years of age.] All users who are minors in the jurisdiction in which they reside (generally under the age of 18) must have the permission of, and be directly supervised by, their parent or guardian to use the Site. If you are a minor, you must have your parent or guardian read and agree to these Terms and Conditions prior to you using the Site.`,
  },
];

export default function TermOfServicePage() {
  const router = useRouter();

  return (
    <div style={{ padding: "40px 60px", maxWidth: "900px", width: "100%", boxSizing: "border-box" }}>
      {/* Title */}
      <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: 700, margin: "0 0 12px" }}>Term of Service</h1>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", lineHeight: 1.6, margin: "0 0 28px", maxWidth: "700px" }}>
        A privacy policy is a legal document where you disclose what data you collect from users, how you manage the collected data and how you use that data. The important objective of a privacy policy is to inform users how you collect, use and manage the collected.
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "32px" }}>
        <button onClick={() => router.push("/dashboard/privacy-policy")} style={{ padding: "10px 20px", background: "transparent", border: "none", borderBottom: "2px solid transparent", color: "rgba(255,255,255,0.45)", fontSize: "14px", cursor: "pointer" }}>
          Privacy policy
        </button>
        <button style={{ padding: "10px 20px", background: "transparent", border: "none", borderBottom: "2px solid #7b68ee", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
          Term of Service
        </button>
      </div>

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {termsContent.map((section, i) => (
          <div key={i} style={section.highlight ? { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "16px 20px" } : {}}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.75, margin: 0 }}>{section.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
