const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

const ALLOWED_STACKS = new Set(["backend", "frontend"]);
const ALLOWED_LEVELS = new Set(["debug", "info", "warn", "error", "fatal"]);
const ALLOWED_PACKAGES = new Set([
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
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

let loggerConfig = {
  token: process.env.AFFORDMED_AUTH_TOKEN || "",
  endpoint: LOG_API_URL,
  timeoutMs: 10000
};

function initLogger(config = {}) {
  loggerConfig = {
    ...loggerConfig,
    ...config
  };
}

function assertAllowed(value, allowedSet, fieldName) {
  if (!allowedSet.has(value)) {
    throw new Error(
      `${fieldName} must be one of: ${Array.from(allowedSet).join(", ")}`
    );
  }
}

function buildTimeoutSignal(timeoutMs) {
  if (typeof AbortSignal !== "undefined" && AbortSignal.timeout) {
    return AbortSignal.timeout(timeoutMs);
  }

  return undefined;
}

async function Log(stack, level, packageName, message) {
  if (!loggerConfig.token) {
    throw new Error(
      "Missing auth token. Call initLogger({ token }) or set AFFORDMED_AUTH_TOKEN."
    );
  }

  if (!stack || !level || !packageName || !message) {
    throw new Error("stack, level, package and message are required.");
  }

  assertAllowed(stack, ALLOWED_STACKS, "stack");
  assertAllowed(level, ALLOWED_LEVELS, "level");
  assertAllowed(packageName, ALLOWED_PACKAGES, "package");

  const payload = {
    stack,
    level,
    package: packageName,
    message
  };

  const response = await fetch(loggerConfig.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loggerConfig.token}`
    },
    body: JSON.stringify(payload),
    signal: buildTimeoutSignal(loggerConfig.timeoutMs)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      `Log API failed (${response.status}): ${data.message || "Unknown error"}`
    );
  }

  return data;
}

module.exports = {
  Log,
  initLogger
};
