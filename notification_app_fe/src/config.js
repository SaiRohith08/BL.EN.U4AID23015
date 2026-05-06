// Use Vite proxy aliases to avoid browser CORS/network issues.
export const API_BASE_URLS = [
  "/api1/evaluation-service",
  "/api2/evaluation-service"
];

export const AUTH_TOKEN = import.meta.env.VITE_AFFORDMED_AUTH_TOKEN || "";

export const LOG_ENDPOINTS = API_BASE_URLS.map((base) => `${base}/logs`);
export const NOTIFICATIONS_ENDPOINTS = API_BASE_URLS.map(
  (base) => `${base}/notifications`
);
