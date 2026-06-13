export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://api.quizquestion.ai";

export type ApiErrorDetails = Record<string, string[] | string> | null;

export class ApiError extends Error {
  details: ApiErrorDetails;

  constructor(message: string, details: ApiErrorDetails = null) {
    super(message);
    this.details = details;
  }
}

async function request<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success === false) {
    throw new ApiError(data?.message || "Request failed", data?.data || null);
  }

  return data as T;
}

async function requestGet<T>(path: string, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success === false) {
    throw new ApiError(data?.message || "Request failed", data?.data || null);
  }

  return data as T;
}

async function requestPatch<T>(path: string, body: Record<string, unknown>, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success === false) {
    throw new ApiError(data?.message || "Request failed", data?.data || null);
  }

  return data as T;
}

async function requestPatchFormData<T>(path: string, body: FormData, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success === false) {
    throw new ApiError(data?.message || "Request failed", data?.data || null);
  }

  return data as T;
}

export type AuthTokens = {
  access: string;
  refresh?: string;
};

export type SignupResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: unknown;
};

export type VerifyOtpResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    access: string;
    refresh: string;
    user: {
      id: string;
      email: string;
      role?: string;
    };
  };
};

export type LoginResponse = VerifyOtpResponse;

export type ForgotPasswordResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    email?: string;
  };
};

export type ResetVerifyOtpResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    secret_key: string;
  };
};

export type ResetPasswordResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: Record<string, never>;
};

export type ProfileResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    email: string;
    name: string;
    image_url: string | null;
    description: string;
    problems_solved: number;
    study_minutes: number;
    active_days: number;
    two_factor_enabled: boolean;
    badges: unknown[];
    level: number;
    birth_date: string | null;
    is_parent: boolean;
    created_at: string;
    updated_at: string;
  };
};

export type ProfileUpdatePayload = {
  name?: string;
  image_url?: string;
  description?: string;
};

export type ProfileUpdateFormDataPayload = {
  name?: string;
  description?: string;
  image?: File | null;
  birth_date?: string | null;
};

export type ChatAskModel = "gpt" | "claude" | "gemini";

export type ChatAskResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    role: string;
    content: string;
  };
};

export function signup(email: string, password: string) {
  return request<SignupResponse>("/auth/signup/", { email, password });
}

export function verifyOtp(email: string, otpCode: string) {
  return request<VerifyOtpResponse>("/auth/verify-otp/", {
    email,
    otp_code: otpCode,
  });
}

export function login(email: string, password: string) {
  return request<LoginResponse>("/auth/login/", { email, password });
}

export function forgotPassword(email: string) {
  return request<ForgotPasswordResponse>("/auth/forgot-password/", { email });
}

export function verifyResetOtp(email: string, otpCode: string) {
  return request<ResetVerifyOtpResponse>("/auth/new/verify-otp/", {
    email,
    otp_code: otpCode,
  });
}

export function resetPassword(email: string, secretKey: string, newPassword: string) {
  return request<ResetPasswordResponse>("/auth/new/reset-password/", {
    user_email: email,
    secret_key: secretKey,
    new_password: newPassword,
  });
}

export function getProfile(accessToken?: string) {
  return requestGet<ProfileResponse>("/profile/", accessToken);
}

export function updateProfile(payload: ProfileUpdatePayload, accessToken?: string) {
  return requestPatch<ProfileResponse>("/profile/", payload, accessToken);
}

export function updateProfileFormData(payload: ProfileUpdateFormDataPayload, accessToken?: string) {
  const formData = new FormData();
  if (payload.name !== undefined) formData.append("name", payload.name);
  if (payload.description !== undefined) formData.append("description", payload.description);
  if (payload.image) formData.append("image", payload.image);
  if (payload.birth_date) formData.append("birth_date", payload.birth_date);

  return requestPatchFormData<ProfileResponse>("/profile/", formData, accessToken);
}
function getStoredAccessToken(): string {
  if (typeof window === "undefined") return "";
  const key = "qqai_access_token";
  const fromLS = localStorage.getItem(key);
  if (fromLS) return fromLS;
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${key}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : "";
}

export function askChat(message: string, model: ChatAskModel) {
  const token = getStoredAccessToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return fetch(`${API_BASE_URL}/chat/ask/`, {
    method: "POST",
    headers,
    body: JSON.stringify({ message, model }),
  }).then(async (res) => {
    const data = await res.json().catch(() => null);
    if (!res.ok || data?.success === false) {
      throw new ApiError(data?.message || "Request failed", data?.data || null);
    }
    return data as ChatAskResponse;
  });
}

export function askChatFormData(params: {
  message: string;
  model: ChatAskModel;
  subject?: string;
  image?: File;
  file?: File;
}): Promise<ChatAskResponse> {
  const token = getStoredAccessToken();

  const formData = new FormData();
  formData.append("message", params.message);
  formData.append("model", params.model);
  if (params.subject) formData.append("subject", params.subject);
  if (params.image) formData.append("image", params.image);
  if (params.file) formData.append("file", params.file);

  return fetch(`${API_BASE_URL}/chat/ask/`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
    .then(async (res) => {
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.success === false) {
        throw new ApiError(data?.message || "Request failed", data?.data || null);
      }
      return data as ChatAskResponse;
    });
}

export type ChatHistoryItem = {
  id: string;
  prompt: string;
  ai_response: string;
  image_url: string | null;
  file_url: string | null;
  created_at: string;
};

export type ChatHistoryResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: ChatHistoryItem[];
  timestamp: string;
};

export function getChatHistory(): Promise<ChatHistoryResponse> {
  const token = getStoredAccessToken();
  return fetch(`${API_BASE_URL}/chat/ask/`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
    .then(async (res) => {
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.success === false) {
        throw new ApiError(data?.message || "Request failed", data?.data || null);
      }
      return data as ChatHistoryResponse;
    });
}

export function deleteAllChatHistory(): Promise<{ success: boolean; message: string }> {
  const token = getStoredAccessToken();
  return fetch(`${API_BASE_URL}/chat/ask/`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
    .then(async (res) => {
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.success === false) {
        throw new ApiError(data?.message || "Failed to delete history", data?.data || null);
      }
      return data;
    });
}

export type ChildScanItem = {
  id: string;
  subject: string;
  image_url: string | null;
  question: string;
  ai_response: string;
};

export type ChildScansResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Record<string, ChildScanItem[]>;
  timestamp: string;
};

export type ChildChatItem = {
  id: string;
  prompt: string;
  ai_response: string;
  image_url: string | null;
  file_url: string | null;
  created_at: string;
};

export type ChildChatsResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Record<string, ChildChatItem[]>;
  timestamp: string;
};

export function createParentalRelation(relatedEmail: string, relationType: string): Promise<{ success: boolean; message: string }> {
  const token = getStoredAccessToken();
  return fetch(`${API_BASE_URL}/2fa/parental-control/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      related_email: relatedEmail,
      relation_type: relationType,
    }),
  }).then(async (res) => {
    const data = await res.json().catch(() => null);
    if (!res.ok || data?.success === false) {
      throw new ApiError(data?.message || "Failed to create relation", data?.data || null);
    }
    return data;
  });
}

export function getChildScans(): Promise<ChildScansResponse> {
  const token = getStoredAccessToken();
  return fetch(`${API_BASE_URL}/2fa/parental-control/child-scans/`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then(async (res) => {
    const data = await res.json().catch(() => null);
    if (!res.ok || data?.success === false) {
      throw new ApiError(data?.message || "Failed to fetch child scans", data?.data || null);
    }
    return data as ChildScansResponse;
  });
}

export function getChildChats(): Promise<ChildChatsResponse> {
  const token = getStoredAccessToken();
  return fetch(`${API_BASE_URL}/2fa/parental-control/child-chats/`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then(async (res) => {
    const data = await res.json().catch(() => null);
    if (!res.ok || data?.success === false) {
      throw new ApiError(data?.message || "Failed to fetch child chats", data?.data || null);
    }
    return data as ChildChatsResponse;
  });
}

export type AiPersonalizationItem = {
  model: string;
  response_sytel: string;
  dificulty_level: string;
  language: string;
  subject_focus_area: string;
};

export type AiPersonalizationResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    items: AiPersonalizationItem[];
    count: number;
  };
  timestamp: string;
};

export function getAiPersonalization(): Promise<AiPersonalizationResponse> {
  const token = getStoredAccessToken();
  return fetch(`${API_BASE_URL}/scan/ai-personalization/`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then(async (res) => {
    const data = await res.json().catch(() => null);
    if (!res.ok || data?.success === false) {
      throw new ApiError(data?.message || "Failed to fetch AI personalization", data?.data || null);
    }
    return data as AiPersonalizationResponse;
  });
}

/* ───── Two-Factor Authentication ───── */

export type TwoFactorSendResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    email: string;
  };
  timestamp: string;
};

export type TwoFactorVerifyResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    two_factor_enabled: boolean;
    verified_at: string;
  };
  timestamp: string;
};

export type TwoFactorStatusResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    two_factor_enabled: boolean;
    verified_at?: string;
  };
  timestamp: string;
};

export function send2faCode(email: string): Promise<TwoFactorSendResponse> {
  const token = getStoredAccessToken();
  return fetch(`${API_BASE_URL}/2fa/send/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ email }),
  }).then(async (res) => {
    const data = await res.json().catch(() => null);
    if (!res.ok || data?.success === false) {
      throw new ApiError(data?.message || "Failed to send code", data?.data || null);
    }
    return data as TwoFactorSendResponse;
  });
}

export function verify2faCode(email: string, otpCode: string): Promise<TwoFactorVerifyResponse> {
  const token = getStoredAccessToken();
  return fetch(`${API_BASE_URL}/2fa/verify/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ email, otp_code: otpCode }),
  }).then(async (res) => {
    const data = await res.json().catch(() => null);
    if (!res.ok || data?.success === false) {
      throw new ApiError(data?.message || "Verification failed", data?.data || null);
    }
    return data as TwoFactorVerifyResponse;
  });
}

export function get2faStatus(email: string, otpCode?: string): Promise<TwoFactorStatusResponse> {
  const token = getStoredAccessToken();
  const params = new URLSearchParams();
  params.append("email", email);
  if (otpCode) {
    params.append("otp_code", otpCode);
  }
  return fetch(`${API_BASE_URL}/2fa/status/?${params.toString()}`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then(async (res) => {
    const data = await res.json().catch(() => null);
    if (!res.ok || data?.success === false) {
      throw new ApiError(data?.message || "Failed to fetch 2FA status", data?.data || null);
    }
    return data as TwoFactorStatusResponse;
  });
}


