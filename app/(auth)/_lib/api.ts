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

