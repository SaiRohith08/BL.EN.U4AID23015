import { AUTH_TOKEN, LOG_ENDPOINTS } from "../config";

const ALLOWED_LEVELS = new Set(["debug", "info", "warn", "error", "fatal"]);
const ALLOWED_PACKAGES = new Set([
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style",
  "auth",
  "config",
  "middleware",
  "utils"
]);

async function trySend(endpoint, payload, authValue) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authValue
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  return { response, data };
}

export async function Log(
  stack = "frontend",
  level,
  packageName,
  message,
  token = AUTH_TOKEN
) {
  if (!token || !level || !packageName || !message) {
    return;
  }
  if (stack !== "frontend") {
    return;
  }
  if (!ALLOWED_LEVELS.has(level) || !ALLOWED_PACKAGES.has(packageName)) {
    return;
  }

  const payload = { stack, level, package: packageName, message };

  for (const endpoint of LOG_ENDPOINTS) {
    let { response } = await trySend(endpoint, payload, `Bearer ${token}`);
    if (response.status === 401) {
      ({ response } = await trySend(endpoint, payload, token));
    }
    if (response.ok) {
      return;
    }
  }
}
