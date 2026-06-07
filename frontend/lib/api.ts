const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sp_token");
}

async function req<T>(
  path: string,
  options: RequestInit = {},
  auth = true
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (auth) {
    const token = getToken();
    if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const api = {
  auth: {
    login: (username: string, password: string) =>
      req<{ access_token: string; username: string; email: string }>(
        "/api/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }, false
      ),
    requestOtp: (email: string) =>
      req<{ message: string }>("/api/auth/register/request-otp", { method: "POST", body: JSON.stringify({ email }) }, false),
    verifyOtp: (email: string, otp: string) =>
      req<{ message: string }>("/api/auth/register/verify-otp", { method: "POST", body: JSON.stringify({ email, otp }) }, false),
    registerComplete: (email: string, otp: string, username: string, password: string) =>
      req<{ access_token: string; username: string; email: string }>(
        "/api/auth/register/complete", { method: "POST", body: JSON.stringify({ email, otp, username, password }) }, false
      ),
    forgotRequestOtp: (email: string) =>
      req<{ message: string }>("/api/auth/forgot-password/request-otp", { method: "POST", body: JSON.stringify({ email }) }, false),
    forgotReset: (email: string, otp: string, new_password: string) =>
      req<{ message: string }>("/api/auth/forgot-password/reset", { method: "POST", body: JSON.stringify({ email, otp, new_password }) }, false),
  },

  // ── Chat ─────────────────────────────────────────────────────────────────────
  chats: {
    list: () => req<{ id: string; label: string; message_count: number }[]>("/api/chats"),
    create: () => req<{ id: string; messages: unknown[] }>("/api/chats", { method: "POST" }),
    get: (id: string) => req<{ id: string; messages: { role: string; text: string }[] }>(`/api/chats/${id}`),
    send: (id: string, message: string) =>
      req<{ reply: string; sentiment: Record<string, number>; messages: { role: string; text: string }[] }>(
        `/api/chats/${id}/message`, { method: "POST", body: JSON.stringify({ message }) }
      ),
    delete: (id: string) => req<{ message: string }>(`/api/chats/${id}`, { method: "DELETE" }),
    rename: (id: string, title: string) => req<{ message: string }>(`/api/chats/${id}`, { method: "PATCH", body: JSON.stringify({ title }) }),
  },

  // ── Summaries ────────────────────────────────────────────────────────────────
  summaries: {
    list: () => req<{ id: string; title: string; has_output: boolean }[]>("/api/summaries"),
    create: () => req<{ id: string; title: string }>("/api/summaries", { method: "POST" }),
    get: (id: string) => req<{ id: string; title: string; text: string; summary: string; word_count: number; format_style: string }>(`/api/summaries/${id}`),
    generate: (id: string, text: string, word_count: number, format_style: string) =>
      req<{ id: string; summary: string; title: string }>(
        `/api/summaries/${id}/generate`, { method: "POST", body: JSON.stringify({ text, word_count, format_style }) }
      ),
    rename: (id: string, title: string) => req<{ message: string }>(`/api/summaries/${id}`, { method: "PATCH", body: JSON.stringify({ title }) }),
    delete: (id: string) => req<{ message: string }>(`/api/summaries/${id}`, { method: "DELETE" }),
  },

  // ── Plans ────────────────────────────────────────────────────────────────────
  plans: {
    list: () => req<{ id: string; title: string; has_schedule: boolean }[]>("/api/plans"),
    create: () => req<{ id: string; title: string }>("/api/plans", { method: "POST" }),
    get: (id: string) => req<Record<string, unknown>>(`/api/plans/${id}`),
    generate: (id: string, subjects: string, weak_subject: string, start_time: string, end_time: string, mood: string) =>
      req<Record<string, unknown>>(
        `/api/plans/${id}/generate`, { method: "POST", body: JSON.stringify({ subjects, weak_subject, start_time, end_time, mood }) }
      ),
    rename: (id: string, title: string) => req<{ message: string }>(`/api/plans/${id}`, { method: "PATCH", body: JSON.stringify({ title }) }),
    delete: (id: string) => req<{ message: string }>(`/api/plans/${id}`, { method: "DELETE" }),
  },
};
