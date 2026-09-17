// All calls to the FastAPI backend live here.

// Thrown when the server says the passkey is missing or expired
export class AuthError extends Error {}

async function request(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && path !== "/api/login") throw new AuthError(data.detail || "Passkey required");
  if (!res.ok) throw new Error(data.detail || `Request failed (${res.status})`);
  return data;
}

export async function sendMessage(message, history) {
  const data = await request("/api/chat", { method: "POST", body: JSON.stringify({ message, history }) });
  return data.reply;
}

export const getInfo = () => request("/api/info");
export const getSession = () => request("/api/session");
export const login = (passkey) => request("/api/login", { method: "POST", body: JSON.stringify({ passkey }) });
export const logout = () => request("/api/logout", { method: "POST" });
