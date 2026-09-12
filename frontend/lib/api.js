const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

export function getAssetUrl(assetPath) {
  if (!assetPath || assetPath.startsWith("http")) return assetPath || "";
  return `${API_URL}${assetPath.startsWith("/") ? assetPath : `/${assetPath}`}`;
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("signaldesk_token");
}

export function setToken(token) {
  if (typeof window !== "undefined")
    window.localStorage.setItem("signaldesk_token", token);
}

export function clearToken() {
  if (typeof window !== "undefined")
    window.localStorage.removeItem("signaldesk_token");
}

async function request(path, options = {}, baseUrl = API_URL) {
  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!(options.body instanceof FormData))
    headers.set("Content-Type", "application/json");

  let response;

  try {
    response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  } catch (networkError) {
    throw new ApiError(
      `Unable to reach the backend at ${API_URL}. Start the backend server and try again.`,
      0,
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new ApiError(
      payload?.message || "The request could not be completed.",
      response.status,
    );
  }
  return payload;
}

export const api = {
  register: (body) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/api/auth/me"),
  getProfile: () => request("/api/user/profile"),
  updateProfile: (body) =>
    request("/api/user/profile", {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  getDashboard: () => request("/api/dashboard/overview"),
  getMarket: () => request("/api/market", {}, ""),
  getJobs: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(
        ([, value]) => value !== "" && value !== undefined && value !== null,
      ),
    );
    return request(`/api/jobs${query.toString() ? `?${query}` : ""}`);
  },
  getJob: (id) => request(`/api/jobs/${id}`),
  syncJobs: (body) =>
    request("/api/jobs/sync", { method: "POST", body: JSON.stringify(body) }),
  getResume: () => request("/api/resume/me"),
  uploadResume: (file, roadmapDuration) => {
    const body = new FormData();
    body.append("resume", file);
    body.append("roadmapDuration", String(roadmapDuration));
    return request("/api/resume/upload", { method: "POST", body });
  },
  analyzeResume: (roadmapDuration) =>
    request("/api/resume/analyze", {
      method: "POST",
      body: JSON.stringify({ roadmapDuration }),
    }),
};
