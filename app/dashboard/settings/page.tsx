"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getProfile, 
  updateProfileFormData, 
  createParentalRelation, 
  getChildScans, 
  getChildChats, 
  type ChildScanItem, 
  type ChildChatItem,
  deleteAllChatHistory,
  getChatHistory,
  send2faCode,
  verify2faCode,
  get2faStatus
} from "@/app/(auth)/_lib/api";
import { getAccessToken } from "@/app/(auth)/_lib/authStorage";
import ModelSelector from "../_components/ModelSelector";
import { 
  Sparkles, 
  Calculator, 
  Atom, 
  FlaskConical, 
  Dna, 
  BookOpen, 
  Laptop, 
  PenTool, 
  LineChart,
  Zap,
  Scale,
  GraduationCap,
  Download,
  Trash2,
  Eraser,
  Users,
  Paperclip,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  Shield,
  Info
} from "lucide-react";

const aiModels = [
  { id: "auto", name: "Auto", badge: "Smart", badgeColor: "#22c55e", desc: "Automatically picks the best model for your question", image: "/images/ai-logo.png" },
  { id: "qq-ai", name: "QQ AI", badge: "Quick", badgeColor: "#7b68ee", desc: "Fast & accurate answers powered by Quiz Question AI", image: "/images/ai-logo.png" },
  { id: "gpt-4o", name: "GPT-4o", badge: "OpenAI", badgeColor: "#22c55e", desc: "Best for complex reasoning & long answers", image: "/images/gpt.png" },
  { id: "gemini-pro", name: "Gemini Pro", badge: "Google", badgeColor: "#4285f4", desc: "Excellent for math, code, and multimodal tasks", image: "/images/gemini.png" },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", badge: "Anthropic", badgeColor: "#f59e0b", desc: "Balanced for speed, coding, and nuanced reasoning", image: "/images/claude.png" },
  { id: "claude-opus-4-6", name: "Claude Opus 4.6", badge: "Anthropic", badgeColor: "#f59e0b", desc: "Best for complex academic reasoning and deep research", image: "/images/claude.png" },
];

const responseStyles = [
  { id: "concise", name: "Concise", desc: "Short & to the point", icon: Zap },
  { id: "balanced", name: "Balanced", desc: "Clear with context", icon: Scale },
  { id: "detailed", name: "Detailed", desc: "Full explanation", icon: BookOpen },
  { id: "formal", name: "Formal", desc: "Academic tone", icon: GraduationCap },
];

const subjects = [
  { id: "mathematics", name: "Mathematics", icon: Calculator },
  { id: "physics", name: "Physics", icon: Atom },
  { id: "chemistry", name: "Chemistry", icon: FlaskConical },
  { id: "biology", name: "Biology", icon: Dna },
  { id: "history", name: "History", icon: BookOpen },
  { id: "cs", name: "CS", icon: Laptop },
  { id: "literature", name: "Literature", icon: PenTool },
  { id: "economics", name: "Economics", icon: LineChart },
];

const cardStyle: React.CSSProperties = {
  backgroundColor: "#111118",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: "16px",
  padding: "24px 28px",
  width: "100%",
  boxSizing: "border-box",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  backgroundColor: "#0A0A0F",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "#ffffff",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  color: "rgba(255,255,255,0.55)",
  fontSize: "12px",
  fontWeight: 500,
  marginBottom: "6px",
  display: "block",
};

interface ToggleProps {
  active: boolean;
  onClick: () => void;
}

function Toggle({ active, onClick }: ToggleProps) {
  return (
    <div
      onClick={onClick}
      style={{
        width: "40px", height: "22px", borderRadius: "11px",
        backgroundColor: active ? "#22c55e" : "rgba(255,255,255,0.15)",
        cursor: "pointer", position: "relative", transition: "all 0.2s ease",
        flexShrink: 0,
      }}
    >
      <div style={{
        width: "16px", height: "16px", borderRadius: "50%",
        backgroundColor: "#fff", position: "absolute", top: "3px",
        left: active ? "21px" : "3px", transition: "all 0.2s ease",
      }} />
    </div>
  );
}

export default function SettingsPage() {
  const [selectedModel, setSelectedModel] = useState("auto");
  const [askModel, setAskModel] = useState("auto");
  const [responseStyle, setResponseStyle] = useState("balanced");
  const [difficulty, setDifficulty] = useState(50);
  const [selectedSubjects, setSelectedSubjects] = useState(["mathematics", "physics"]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        const savedModel = localStorage.getItem("preferred_model");
        if (savedModel) {
          setSelectedModel(savedModel);
          setAskModel(savedModel);
        }

        const savedStyle = localStorage.getItem("response_style");
        if (savedStyle) setResponseStyle(savedStyle);

        const savedDiff = localStorage.getItem("difficulty_level");
        if (savedDiff) setDifficulty(Number(savedDiff));

        const savedSubjects = localStorage.getItem("selected_subjects");
        if (savedSubjects) {
          try {
            setSelectedSubjects(JSON.parse(savedSubjects));
          } catch {}
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSavePreferences = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred_model", selectedModel);
      localStorage.setItem("response_style", responseStyle);
      localStorage.setItem("difficulty_level", String(difficulty));
      localStorage.setItem("selected_subjects", JSON.stringify(selectedSubjects));
      toast.success("Preferences saved successfully!");
    }
  };

  const [parentalRole, setParentalRole] = useState("parent");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [chatHistoryExport, setChatHistoryExport] = useState(true);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileDescription, setProfileDescription] = useState("");
  const [profileBirthDate, setProfileBirthDate] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  const [childScans, setChildScans] = useState<Record<string, ChildScanItem[]>>({});
  const [childChats, setChildChats] = useState<Record<string, ChildChatItem[]>>({});
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState("");

  const queryClient = useQueryClient();

  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean | null>(null);
  const [twoFactorVerifiedAt, setTwoFactorVerifiedAt] = useState<string | null>(null);
  const [twoFactorStep, setTwoFactorStep] = useState<"status" | "method" | "confirm_email" | "verify_code">("status");
  const [otpCode, setOtpCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);
  const [emailFor2fa, setEmailFor2fa] = useState("");


  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await getChatHistory();
      if (response && response.success && response.data) {
        const history = response.data;
        if (history.length === 0) {
          toast.info("No chat history to export.");
          return;
        }
        
        let fileContent = `=== QUIZ QUESTION AI CHAT HISTORY ===\n`;
        fileContent += `Exported on: ${new Date().toLocaleString()}\n\n`;
        
        history.forEach((item, index) => {
          fileContent += `----------------------------------------\n`;
          fileContent += `Chat #${index + 1}\n`;
          fileContent += `Date: ${new Date(item.created_at).toLocaleString()}\n`;
          fileContent += `Question: ${item.prompt}\n\n`;
          fileContent += `Answer:\n${item.ai_response}\n`;
          if (item.image_url) {
            fileContent += `Image Attachment: ${item.image_url}\n`;
          }
          if (item.file_url) {
            fileContent += `File Attachment: ${item.file_url}\n`;
          }
          fileContent += `----------------------------------------\n\n`;
        });
        
        const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `quiz_question_ai_chat_history_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success("Chat history exported successfully!");
      } else {
        toast.error("Failed to retrieve chat history for export.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to export chat history.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAllChatHistory = async () => {
    if (!window.confirm("Are you sure you want to delete all chat history? This action cannot be undone.")) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await deleteAllChatHistory();
      if (res.success) {
        toast.success("All ask history deleted successfully.");
        queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
      } else {
        toast.error(res.message || "Failed to delete chat history.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to delete chat history.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearCache = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("preferred_model");
      localStorage.removeItem("response_style");
      localStorage.removeItem("difficulty_level");
      localStorage.removeItem("selected_subjects");
      
      setSelectedModel("auto");
      setAskModel("auto");
      setResponseStyle("balanced");
      setDifficulty(50);
      setSelectedSubjects(["mathematics", "physics"]);
      
      toast.success("Cache & local preferences cleared successfully!");
    }
  };

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(getAccessToken()),
    staleTime: 60_000,
  });

  const profileData = profileQuery.data?.data;

  // Sync profile data to local state for inputs when data resolves
  useEffect(() => {
    if (profileData) {
      const timer = setTimeout(() => {
        setProfileName(profileData.name || "");
        setProfileEmail(profileData.email || "");
        setProfileImageUrl(profileData.image_url || "");
        setProfileDescription(profileData.description || "");
        setProfileBirthDate(profileData.birth_date ? profileData.birth_date.slice(0, 10) : "");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [profileData]);

  // Sync profile data or fetch status from /2fa/status/
  useEffect(() => {
    if (profileData?.email) {
      setEmailFor2fa(profileData.email);
      
      setIsFetchingStatus(true);
      get2faStatus(profileData.email)
        .then((res) => {
          setTwoFactorEnabled(res.data?.two_factor_enabled);
          if (res.data?.verified_at) {
            setTwoFactorVerifiedAt(res.data?.verified_at);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch 2FA status:", err);
          setTwoFactorEnabled(!!profileData.two_factor_enabled);
        })
        .finally(() => {
          setIsFetchingStatus(false);
        });
    }
  }, [profileData?.email, profileData?.two_factor_enabled]);

  const isParent = !!profileData?.is_parent;

  const handleSendInvite = async () => {
    if (!inviteEmail || !inviteEmail.includes("@")) {
      setInviteError("Please enter a valid email address.");
      setInviteSuccess("");
      return;
    }
    setInviteError("");
    setInviteSuccess("");
    setIsInviting(true);
    try {
      await createParentalRelation(inviteEmail, parentalRole);
      setInviteSuccess(`Invitation successfully sent to ${inviteEmail} as ${parentalRole}.`);
      setInviteEmail("");
    } catch (err: unknown) {
      setInviteError(err instanceof Error ? err.message : "Failed to send parental control invitation.");
    } finally {
      setIsInviting(false);
    }
  };

  const handleOpenActivity = async () => {
    if (!isParent) return;
    setShowActivityModal(true);
    setIsLoadingActivity(true);
    setActivityError("");
    try {
      const [scansRes, chatsRes] = await Promise.all([
        getChildScans(),
        getChildChats()
      ]);
      setChildScans(scansRes.data || {});
      setChildChats(chatsRes.data || {});
    } catch (err: unknown) {
      setActivityError(err instanceof Error ? err.message : "Failed to load children activity.");
    } finally {
      setIsLoadingActivity(false);
    }
  };

  const updateProfileMutation = useMutation({
    mutationFn: () => updateProfileFormData({
      name: profileName,
      description: profileDescription,
      image: profileImageFile,
      birth_date: profileBirthDate || null,
    }, getAccessToken()),
    onSuccess: (data) => {
      setProfileName(data.data.name || "");
      setProfileEmail(data.data.email || "");
      setProfileImageUrl(data.data.image_url || "");
      setProfileDescription(data.data.description || "");
      setProfileBirthDate((data.data.birth_date || "").slice(0, 10));
      setProfileImageFile(null);
      toast.success("Profile updated successfully.");
      setProfileError("");
      setIsEditingProfile(false);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: Error) => {
      setProfileError(err?.message || "Profile update failed.");
    },
  });

  const handleProfileUpdate = () => {
    setProfileError("");
    updateProfileMutation.mutate();
  };

  const handleToggleEditProfile = () => {
    setProfileError("");

    if (!isEditingProfile) {
      setProfileName(profileData?.name || "");
      setProfileEmail(profileData?.email || "");
      setProfileImageUrl(profileData?.image_url || "");
      setProfileDescription(profileData?.description || "");
      setProfileBirthDate((profileData?.birth_date || "").slice(0, 10));
      setProfileImageFile(null);
    } else {
      setProfileImageFile(null);
    }

    setIsEditingProfile((prev) => !prev);
  };

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const getDiffLabel = () => {
    if (difficulty < 25) return "Beginner";
    if (difficulty < 50) return "Intermediate";
    if (difficulty < 75) return "Advanced";
    return "Expert";
  };

  return (
    <div style={{ backgroundColor: "#0A0A0F", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        .settings-body {
          flex: 1;
          padding: 32px 36px;
        }
        .settings-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 24px;
          align-items: flex-start;
        }
        @media (max-width: 900px) {
          .settings-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .settings-body {
            padding: 20px 14px !important;
          }
        }
      `}</style>

      {/* Page Body */}
      <div className="settings-body">

        {/* Logo */}
        <div style={{ marginBottom: "28px" }}>
          <img src="/images/ai-logo.png" alt="Quiz Question AI" style={{ height: "36px", objectFit: "contain" }} />
        </div>

        {/* 2 Column Grid */}
        <div className="settings-grid">

          {/* ===== LEFT ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Profile Settings */}
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: 0 }}>Profile Settings</h2>
                <button
                  onClick={handleToggleEditProfile}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {isEditingProfile ? "Cancel" : "Edit"}
                </button>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "14px" }}>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "18px",
                    fontWeight: 700,
                  }}
                >
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    (profileName || profileEmail || "U").slice(0, 2).toUpperCase()
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div>
                    <label style={labelStyle}>Upload New Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      style={inputStyle}
                      onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    style={inputStyle}
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    readOnly={!isEditingProfile}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    style={inputStyle}
                    value={profileEmail}
                    readOnly
                    disabled
                  />
                </div>
                <div>
                  <label style={labelStyle}>Birth Date (optional)</label>
                  <input
                    type="date"
                    style={inputStyle}
                    value={profileBirthDate}
                    onChange={(e) => setProfileBirthDate(e.target.value)}
                    disabled={!isEditingProfile}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    placeholder="Write something about yourself"
                    style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                    value={profileDescription}
                    onChange={(e) => setProfileDescription(e.target.value)}
                    readOnly={!isEditingProfile}
                  />
                </div>
                {profileError && (
                  <p style={{ color: "#ff6b6b", fontSize: "12px", margin: 0 }}>{profileError}</p>
                )}
                <button
                  onClick={handleProfileUpdate}
                  disabled={!isEditingProfile || updateProfileMutation.isPending}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: isEditingProfile ? "linear-gradient(135deg, #6c5ce7, #7b68ee)" : "rgba(255,255,255,0.08)",
                    border: "none",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: isEditingProfile ? "pointer" : "not-allowed",
                    opacity: updateProfileMutation.isPending ? 0.7 : 1,
                  }}
                >
                  {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div style={cardStyle}>
              <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: "0 0 18px" }}>Change Password</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { label: "Current Password", placeholder: "Password", value: showCurrentPassword, setter: setShowCurrentPassword },
                  { label: "Password", placeholder: "Password", value: showNewPassword, setter: setShowNewPassword },
                  { label: "Confirm Password", placeholder: "Confirm Password", value: showConfirmPassword, setter: setShowConfirmPassword },
                ].map((field) => (
                  <div key={field.label}>
                    <label style={labelStyle}>{field.label}</label>
                    <div style={{ position: "relative" }}>
                      <input type={field.value ? "text" : "password"} placeholder={field.placeholder} style={inputStyle} />
                      <span 
                        onClick={() => field.setter(!field.value)}
                        style={{
                          position: "absolute", right: "12px", top: "50%",
                          transform: "translateY(-50%)", color: "rgba(255,255,255,0.45)",
                          cursor: "pointer", display: "flex", alignItems: "center"
                        }}
                      >
                        {field.value ? <EyeOff size={15} /> : <Eye size={15} />}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ===== RIGHT ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Ask AI */}
            <div style={cardStyle}>
              <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: "0 0 14px" }}>Ask AI</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <ModelSelector
                  size="sm"
                  value={askModel}
                  onChange={(val) => {
                    setAskModel(val);
                    setSelectedModel(val);
                    if (typeof window !== "undefined") {
                      localStorage.setItem("preferred_model", val);
                    }
                  }}
                />
              </div>
              {/* Input removed per request: settings page no longer shows Ask input or Send button */}
              {/* Ask response hidden on settings page */}
            </div>

            {/* AI Personalization */}
            <div style={cardStyle}>
              <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: "0 0 18px" }}>AI Personalization</h2>

              {/* Models */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {aiModels.map((m) => {
                  const isActive = m.id === selectedModel;
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m.id);
                        setAskModel(m.id);
                        if (typeof window !== "undefined") {
                          localStorage.setItem("preferred_model", m.id);
                        }
                      }}
                      style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "12px 16px",
                        backgroundColor: isActive ? "rgba(79,70,229,0.07)" : "rgba(255,255,255,0.02)",
                        border: isActive ? "1px solid rgba(79,70,229,0.35)" : "1px solid rgba(255,255,255,0.04)",
                        borderRadius: "12px", cursor: "pointer", transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: m.id === "auto" ? "linear-gradient(135deg, #22c55e, #10b981)" : "#1a1a28", flexShrink: 0, boxShadow: m.id === "auto" ? "0 2px 8px rgba(34, 197, 94, 0.25)" : "none" }}>
                        {m.id === "auto" ? (
                          <Sparkles size={16} color="#ffffff" strokeWidth={2.5} />
                        ) : (
                          <img src={m.image} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                          <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>{m.name}</span>
                          <span style={{
                            padding: "1px 7px", borderRadius: "10px",
                            backgroundColor: `${m.badgeColor}20`, color: m.badgeColor,
                            fontSize: "10px", fontWeight: 600,
                          }}>{m.badge}</span>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", margin: "2px 0 0" }}>{m.desc}</p>
                      </div>
                      <div style={{
                        width: "18px", height: "18px", borderRadius: "50%",
                        border: `2px solid ${isActive ? "#22c55e" : "rgba(255,255,255,0.15)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        {isActive && <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e" }} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Response Style */}
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 600, margin: "0 0 10px" }}>Response Style</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {responseStyles.map((rs) => {
                    const isActive = rs.id === responseStyle;
                    const IconComponent = rs.icon;
                    return (
                       <div
                        key={rs.id}
                        onClick={() => setResponseStyle(rs.id)}
                        style={{
                          padding: "11px 13px",
                          backgroundColor: isActive ? "rgba(79,70,229,0.1)" : "rgba(255,255,255,0.02)",
                          border: isActive ? "1px solid rgba(79,70,229,0.3)" : "1px solid rgba(255,255,255,0.04)",
                          borderRadius: "10px", cursor: "pointer", transition: "all 0.2s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                          <IconComponent size={14} style={{ color: isActive ? "#7b68ee" : "rgba(255,255,255,0.4)" }} />
                          <span style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.55)", fontSize: "12px", fontWeight: 600 }}>{rs.name}</span>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", margin: "2px 0 0", paddingLeft: "20px" }}>{rs.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <h3 style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 600, margin: 0 }}>Difficulty Level</h3>
                  <span style={{ color: "#7b68ee", fontSize: "11px", fontWeight: 600 }}>{getDiffLabel()}</span>
                </div>
                <input
                  type="range" min="0" max="100" value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#4F46E5", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  {["Beginner", "Intermediate", "Advanced", "Expert"].map((l) => (
                    <span key={l} style={{ color: "rgba(255,255,255,0.22)", fontSize: "10px" }}>{l}</span>
                  ))}
                </div>
              </div>

              {/* Subject Focus */}
              <div style={{ marginBottom: "22px" }}>
                <h3 style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 600, margin: "0 0 10px" }}>Subject Focus Area</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <div
                    onClick={() => {
                      const allIds = subjects.map((s) => s.id);
                      const areAllSelected = selectedSubjects.length === subjects.length;
                      if (areAllSelected) {
                        setSelectedSubjects([]);
                      } else {
                        setSelectedSubjects(allIds);
                      }
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "6px 12px", borderRadius: "20px",
                      backgroundColor: selectedSubjects.length === subjects.length ? "rgba(79,70,229,0.12)" : "rgba(255,255,255,0.02)",
                      border: selectedSubjects.length === subjects.length ? "1px solid rgba(79,70,229,0.3)" : "1px solid rgba(255,255,255,0.06)",
                      color: selectedSubjects.length === subjects.length ? "#fff" : "rgba(255,255,255,0.45)",
                      fontSize: "12px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease",
                    }}
                  >
                    <Sparkles size={13} style={{ color: selectedSubjects.length === subjects.length ? "#a855f7" : "rgba(255,255,255,0.4)" }} />
                    <span>All</span>
                    {selectedSubjects.length === subjects.length && <span style={{ fontSize: "10px", color: "#7b68ee" }}>✓</span>}
                  </div>
                  {subjects.map((s) => {
                    const isSelected = selectedSubjects.includes(s.id);
                    const IconComponent = s.icon;
                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleSubject(s.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: "6px",
                          padding: "6px 12px", borderRadius: "20px",
                          backgroundColor: isSelected ? "rgba(79,70,229,0.12)" : "rgba(255,255,255,0.02)",
                          border: isSelected ? "1px solid rgba(79,70,229,0.3)" : "1px solid rgba(255,255,255,0.06)",
                          color: isSelected ? "#fff" : "rgba(255,255,255,0.45)",
                          fontSize: "12px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease",
                        }}
                      >
                        <IconComponent size={13} style={{ color: isSelected ? "#7b68ee" : "rgba(255,255,255,0.4)" }} />
                        <span>{s.name}</span>
                        {isSelected && <span style={{ fontSize: "10px", color: "#7b68ee" }}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleSavePreferences}
                style={{
                  width: "100%", padding: "13px",
                  background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
                  border: "none", borderRadius: "10px", color: "#fff",
                  fontSize: "13px", fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  marginBottom: "0px",
                }}
              >
                ✨ Save Preferences
              </button>
            </div>

            {/* Parental Control */}
            <div style={cardStyle}>
              <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: "0 0 16px" }}>Parental Control</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                {[
                  { id: "parent", title: "Parent", desc: "Add managing abilities as parent" },
                  { id: "child", title: "Child", desc: "Add Your Child" },
                ].map((item) => (
                  <div key={item.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "13px 16px",
                    backgroundColor: parentalRole === item.id ? "rgba(79,70,229,0.06)" : "rgba(255,255,255,0.02)",
                    border: parentalRole === item.id ? "1px solid rgba(79,70,229,0.2)" : "1px solid rgba(255,255,255,0.04)",
                    borderRadius: "12px",
                  }}>
                    <div>
                      <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, margin: 0 }}>{item.title}</p>
                      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", margin: "2px 0 0" }}>{item.desc}</p>
                    </div>
                    <Toggle active={parentalRole === item.id} onClick={() => setParentalRole(item.id)} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Enter Email</label>
                <input
                  type="email" value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="example@gmail.com" style={inputStyle}
                />
              </div>

              {inviteError && (
                <p style={{ color: "#ff6b6b", fontSize: "12px", margin: "0 0 12px" }}>{inviteError}</p>
              )}
              {inviteSuccess && (
                <p style={{ color: "#22c55e", fontSize: "12px", margin: "0 0 12px" }}>{inviteSuccess}</p>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button
                  onClick={handleOpenActivity}
                  disabled={!isParent}
                  style={{
                    padding: "11px", 
                    backgroundColor: isParent ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.08)", 
                    borderRadius: "10px",
                    color: isParent ? "#fff" : "rgba(255,255,255,0.2)", 
                    fontSize: "12px", 
                    fontWeight: 600, 
                    cursor: isParent ? "pointer" : "not-allowed",
                    transition: "all 0.2s ease",
                  }}
                >
                  See Child&apos;s Activity
                </button>
                <button
                  onClick={handleSendInvite}
                  disabled={isInviting}
                  style={{
                    padding: "11px",
                    background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
                    border: "none", 
                    borderRadius: "10px", 
                    color: "#fff",
                    fontSize: "12px", 
                    fontWeight: 600, 
                    cursor: "pointer",
                    opacity: isInviting ? 0.7 : 1,
                  }}
                >
                  {isInviting ? "Sending..." : "Send Invite"}
                </button>
              </div>
            </div>

            {/* Explore Your Data */}
            <div style={cardStyle}>
              <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: "0 0 16px" }}>Data Control</h2>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {/* Export Data Button */}
                <button 
                  onClick={handleExportData}
                  disabled={isExporting}
                  style={{
                    padding: "10px 18px",
                    background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
                    border: "none", borderRadius: "10px", color: "#fff",
                    fontSize: "13px", fontWeight: 600, cursor: isExporting ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    opacity: isExporting ? 0.7 : 1,
                  }}
                >
                  <Download size={14} />
                  <span>{isExporting ? "Exporting..." : "Export Selected Data"}</span>
                </button>

                {/* Delete Chat History Button */}
                <button 
                  onClick={handleDeleteAllChatHistory}
                  disabled={isDeleting}
                  style={{
                    padding: "10px 18px",
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.2)", 
                    borderRadius: "10px", color: "#ef4444",
                    fontSize: "13px", fontWeight: 600, cursor: isDeleting ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    transition: "all 0.2s ease",
                    opacity: isDeleting ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
                    e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.08)";
                    e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.2)";
                  }}
                >
                  <Trash2 size={14} />
                  <span>{isDeleting ? "Deleting..." : "Delete All Chat History"}</span>
                </button>

                {/* Clear Cache Button */}
                <button 
                  onClick={handleClearCache}
                  style={{
                    padding: "10px 18px",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "10px", color: "rgba(255, 255, 255, 0.75)",
                    fontSize: "13px", fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                  }}
                >
                  <Eraser size={14} />
                  <span>Clear Cache</span>
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div style={cardStyle}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                {twoFactorStep !== "status" && (
                  <button 
                    onClick={() => {
                      if (twoFactorStep === "method") setTwoFactorStep("status");
                      else if (twoFactorStep === "confirm_email") setTwoFactorStep("method");
                      else if (twoFactorStep === "verify_code") setTwoFactorStep("confirm_email");
                    }}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.6)",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                    }}
                  >
                    <ArrowLeft size={16} />
                  </button>
                )}
                <div>
                  <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: 0 }}>
                    {twoFactorStep === "method" ? "Choose Your Method" : "Two-Factor Auth"}
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", margin: "2px 0 0" }}>
                    {twoFactorStep === "method" ? "Select a verification method" : "Add an extra layer of security"}
                  </p>
                </div>
              </div>

              {/* Content */}
              {isFetchingStatus ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
                  <div style={{
                    width: "28px", height: "28px",
                    border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "#6c5ce7",
                    borderRadius: "50%", animation: "spin 1s linear infinite"
                  }} />
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", marginTop: "10px" }}>Checking status...</p>
                </div>
              ) : (
                <>
                  {/* Step 1: STATUS */}
                  {twoFactorStep === "status" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {/* Status block */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "16px",
                        backgroundColor: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.04)",
                        borderRadius: "12px",
                      }}>
                        <div style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: twoFactorEnabled ? "rgba(34, 197, 94, 0.1)" : "rgba(255, 255, 255, 0.04)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: twoFactorEnabled ? "#22c55e" : "rgba(255,255,255,0.4)"
                        }}>
                          {twoFactorEnabled ? <ShieldCheck size={20} /> : <Lock size={20} />}
                        </div>
                        <div>
                          <p style={{ color: "#fff", fontSize: "14px", fontWeight: 600, margin: 0 }}>
                            {twoFactorEnabled ? "2FA Enabled" : "2FA Disabled"}
                          </p>
                          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", margin: "2px 0 0" }}>
                            {twoFactorEnabled ? "Your account has advanced protection active" : "Your account has basic protection only"}
                          </p>
                        </div>
                      </div>

                      {/* Info banner */}
                      <div style={{
                        display: "flex",
                        gap: "12px",
                        padding: "14px",
                        backgroundColor: "rgba(108, 92, 231, 0.04)",
                        border: "1px solid rgba(108, 92, 231, 0.08)",
                        borderRadius: "12px",
                      }}>
                        <div style={{ color: "#7b68ee", flexShrink: 0, marginTop: "2px" }}>
                          <Info size={16} />
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", margin: 0, lineHeight: 1.5 }}>
                          {twoFactorEnabled 
                            ? "Two-factor authentication is active. Codes will be sent to your email to verify your identity on future logins."
                            : "Two-factor authentication adds a second verification step when you sign in, protecting your account even if your password is compromised."}
                        </p>
                      </div>

                      {/* Action button */}
                      <button
                        onClick={() => {
                          if (twoFactorEnabled) {
                            setTwoFactorEnabled(false);
                            toast.success("Two-factor authentication has been disabled.");
                          } else {
                            setTwoFactorStep("method");
                          }
                        }}
                        style={{
                          padding: "11px 20px",
                          background: twoFactorEnabled ? "rgba(239, 68, 68, 0.08)" : "linear-gradient(135deg, #6c5ce7, #7b68ee)",
                          border: twoFactorEnabled ? "1px solid rgba(239, 68, 68, 0.2)" : "none",
                          borderRadius: "10px",
                          color: twoFactorEnabled ? "#ef4444" : "#fff",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          if (twoFactorEnabled) {
                            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
                            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (twoFactorEnabled) {
                            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.08)";
                            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.2)";
                          }
                        }}
                      >
                        {twoFactorEnabled ? (
                          <>
                            <Lock size={14} />
                            <span>Disable 2FA</span>
                          </>
                        ) : (
                          <>
                            <Shield size={14} />
                            <span>Enable 2FA</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Step 2: CHOOSE METHOD */}
                  {twoFactorStep === "method" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {/* Method option: Email */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px",
                        backgroundColor: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(108, 92, 231, 0.2)",
                        borderRadius: "12px",
                        cursor: "pointer",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(108, 92, 231, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#7b68ee"
                          }}>
                            <Mail size={18} />
                          </div>
                          <div>
                            <p style={{ color: "#fff", fontSize: "14px", fontWeight: 600, margin: 0 }}>Email</p>
                            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", margin: "2px 0 0" }}>
                              Receive a code at your registered email address.
                            </p>
                          </div>
                        </div>
                        {/* Custom styled Radio button */}
                        <div style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          border: "2px solid #7b68ee",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <div style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: "#7b68ee"
                          }} />
                        </div>
                      </div>

                      {/* Continue button */}
                      <button
                        onClick={() => setTwoFactorStep("confirm_email")}
                        style={{
                          padding: "11px 20px",
                          background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
                          border: "none",
                          borderRadius: "10px",
                          color: "#fff",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px"
                        }}
                      >
                        <span>Continue</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}

                  {/* Step 3: CONFIRM EMAIL */}
                  {twoFactorStep === "confirm_email" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div>
                        <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>Confirm Your Email</h3>
                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", margin: 0 }}>
                          Codes will be sent to your registered email
                        </p>
                      </div>

                      <div style={{ position: "relative" }}>
                        <div style={{
                          position: "absolute",
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "rgba(255,255,255,0.35)",
                          display: "flex",
                          alignItems: "center"
                        }}>
                          <Mail size={16} />
                        </div>
                        <input
                          type="email"
                          readOnly
                          value={emailFor2fa}
                          style={{
                            width: "100%",
                            padding: "11px 12px 11px 40px",
                            backgroundColor: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "10px",
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "13px",
                            outline: "none",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>

                      {/* Send Code button */}
                      <button
                        onClick={() => {
                          setIsSendingCode(true);
                          send2faCode(emailFor2fa)
                            .then(() => {
                              toast.success("A verification code has been sent to your email. Please check your inbox.");
                              setTwoFactorStep("verify_code");
                            })
                            .catch((err) => {
                              toast.error(err.message || "Failed to send verification code. Please try again.");
                            })
                            .finally(() => {
                              setIsSendingCode(false);
                            });
                        }}
                        disabled={isSendingCode}
                        style={{
                          padding: "11px 20px",
                          background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
                          border: "none",
                          borderRadius: "10px",
                          color: "#fff",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: isSendingCode ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          opacity: isSendingCode ? 0.7 : 1
                        }}
                      >
                        <span>{isSendingCode ? "Sending Code..." : "Send Code"}</span>
                        {!isSendingCode && <ArrowRight size={14} />}
                      </button>
                    </div>
                  )}

                  {/* Step 4: ENTER VERIFICATION CODE */}
                  {twoFactorStep === "verify_code" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center" }}>
                        <div style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(108, 92, 231, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#7b68ee"
                        }}>
                          <Mail size={22} />
                        </div>
                        <div>
                          <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: 600, margin: "0 0 2px" }}>Enter Verification Code</h3>
                          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", margin: 0 }}>
                            Code sent to {emailFor2fa}
                          </p>
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="ENTER CODE"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "11px 12px",
                            backgroundColor: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "10px",
                            color: "#fff",
                            fontSize: "13px",
                            textAlign: "center",
                            letterSpacing: "4px",
                            fontWeight: 700,
                            outline: "none",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {/* Verify Code button */}
                        <button
                          onClick={() => {
                            if (!otpCode.trim()) {
                              toast.error("Please enter the verification code.");
                              return;
                            }
                            setIsVerifyingCode(true);
                            verify2faCode(emailFor2fa, otpCode)
                              .then((res) => {
                                toast.success(res.message || "Two-factor authentication has been successfully enabled.");
                                setTwoFactorEnabled(true);
                                setTwoFactorStep("status");
                                setOtpCode("");
                              })
                              .catch((err) => {
                                toast.error(err.message || "Verification failed. Please check the code and try again.");
                              })
                              .finally(() => {
                                setIsVerifyingCode(false);
                              });
                          }}
                          disabled={isVerifyingCode}
                          style={{
                            padding: "11px 20px",
                            background: "linear-gradient(135deg, #6c5ce7, #7b68ee)",
                            border: "none",
                            borderRadius: "10px",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: isVerifyingCode ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: isVerifyingCode ? 0.7 : 1
                          }}
                        >
                          <span>{isVerifyingCode ? "Verifying..." : "Verify Code"}</span>
                        </button>

                        {/* Resend Link */}
                        <button
                          onClick={() => {
                            setIsSendingCode(true);
                            send2faCode(emailFor2fa)
                              .then(() => {
                                toast.success("A new verification code has been sent to your email.");
                              })
                              .catch((err) => {
                                toast.error(err.message || "Failed to resend code.");
                              })
                              .finally(() => {
                                setIsSendingCode(false);
                              });
                          }}
                          disabled={isSendingCode}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#7b68ee",
                            fontSize: "12px",
                            fontWeight: 500,
                            cursor: isSendingCode ? "not-allowed" : "pointer",
                            textDecoration: "none",
                            textAlign: "center"
                          }}
                        >
                          {isSendingCode ? "Resending..." : "Resend code"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </div>

       
      {/* Children Activity Modal */}
      {showActivityModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(10,10,15,0.75)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: "20px", boxSizing: "border-box"
        }}>
          <div style={{
            backgroundColor: "#111118", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "800px",
            maxHeight: "85vh", display: "flex", flexDirection: "column",
            boxShadow: "0 24px 60px rgba(0,0,0,0.8)", boxSizing: "border-box"
          }}>
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: 700, margin: 0 }}>Children Activity Tracker</h3>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: "4px 0 0" }}>Monitor scans and chat logs of linked student accounts</p>
              </div>
              <button
                onClick={() => setShowActivityModal(false)}
                style={{
                  background: "none", border: "none", color: "rgba(255,255,255,0.4)",
                  fontSize: "24px", cursor: "pointer", padding: "4px", lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Content (scrollable) */}
            <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px" }}>
              {isLoadingActivity ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0" }}>
                  <div style={{
                    width: "36px", height: "36px",
                    border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "#6c5ce7",
                    borderRadius: "50%", animation: "spin 1s linear infinite"
                  }} />
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "14px" }}>Fetching children activities...</p>
                </div>
              ) : activityError ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <p style={{ color: "#ff6b6b", fontSize: "14px" }}>{activityError}</p>
                </div>
              ) : Object.keys(childScans).length === 0 && Object.keys(childChats).length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.4)" }}>
                  <Users size={40} style={{ color: "rgba(255,255,255,0.25)", margin: "0 auto 12px", display: "block" }} />
                  <p style={{ fontSize: "14px", fontWeight: 500, margin: 0 }}>No active children accounts found.</p>
                  <p style={{ fontSize: "12px", margin: "6px 0 0" }}>Send a relation invite above to link your child&apos;s account.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {/* List children */}
                  {Array.from(new Set([...Object.keys(childScans), ...Object.keys(childChats)])).map((email) => {
                    const scans = childScans[email] || [];
                    const chats = childChats[email] || [];
                    return (
                      <ChildItemCard key={email} email={email} scans={scans} chats={chats} />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChildItemCard({ email, scans, chats }: { email: string; scans: ChildScanItem[]; chats: ChildChatItem[] }) {
  const [activeTab, setActiveTab] = useState<"scans" | "chats">("scans");

  return (
    <div style={{
      backgroundColor: "#161622",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "14px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <GraduationCap size={18} style={{ color: "#7b68ee" }} />
          <span style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}>{email}</span>
        </div>
        
        {/* Toggle Tab */}
        <div style={{ display: "flex", backgroundColor: "#0A0A0F", padding: "3px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <button
            onClick={() => setActiveTab("scans")}
            style={{
              padding: "5px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: activeTab === "scans" ? "#1e1e2d" : "transparent",
              color: activeTab === "scans" ? "#fff" : "rgba(255,255,255,0.4)",
              transition: "all 0.15s ease"
            }}
          >
            Scans ({scans.length})
          </button>
          <button
            onClick={() => setActiveTab("chats")}
            style={{
              padding: "5px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: activeTab === "chats" ? "#1e1e2d" : "transparent",
              color: activeTab === "chats" ? "#fff" : "rgba(255,255,255,0.4)",
              transition: "all 0.15s ease"
            }}
          >
            Chats ({chats.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "300px", overflowY: "auto" }}>
        {activeTab === "scans" ? (
          scans.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", textAlign: "center", margin: "20px 0" }}>No scans recorded for this child.</p>
          ) : (
            scans.map((scan) => (
              <div key={scan.id} style={{
                backgroundColor: "#0A0A0F", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "10px", padding: "12px 14px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{
                    padding: "2px 8px", backgroundColor: "rgba(108,92,231,0.12)", color: "#7b68ee", borderRadius: "12px", fontSize: "10px", fontWeight: 600
                  }}>
                    {scan.subject.toUpperCase()}
                  </span>
                </div>
                <p style={{ color: "#fff", fontSize: "12px", fontWeight: 600, margin: "0 0 6px" }}>Q: {scan.question}</p>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                  <strong>AI Response:</strong> {scan.ai_response.length > 250 ? scan.ai_response.slice(0, 250) + "..." : scan.ai_response}
                </div>
              </div>
            ))
          )
        ) : (
          chats.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", textAlign: "center", margin: "20px 0" }}>No chat conversations recorded for this child.</p>
          ) : (
            chats.map((chat) => (
              <div key={chat.id} style={{
                backgroundColor: "#0A0A0F", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "10px", padding: "12px 14px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>
                    {new Date(chat.created_at).toLocaleDateString()} {new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {chat.file_url && (
                    <a href={chat.file_url} target="_blank" rel="noreferrer" style={{ color: "#7b68ee", fontSize: "10px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Paperclip size={10} />
                      <span>Attachment</span>
                    </a>
                  )}
                </div>
                {chat.prompt && <p style={{ color: "#fff", fontSize: "12px", fontWeight: 600, margin: "0 0 6px" }}>Prompt: {chat.prompt}</p>}
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                  <strong>AI Response:</strong> {chat.ai_response.length > 250 ? chat.ai_response.slice(0, 250) + "..." : chat.ai_response}
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}