import { AUTH_TOKEN, NOTIFICATIONS_ENDPOINTS } from "../config";

async function requestWithAuth(url, token) {
  let response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (response.status === 401) {
    response = await fetch(url, {
      headers: { Authorization: token }
    });
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed with ${response.status}`);
  }

  return data;
}

function buildUrl(baseEndpoint, { page, limit, notificationType, includePaging }) {
  const params = new URLSearchParams();
  if (includePaging) {
    params.set("page", String(page));
    params.set("limit", String(limit));
  }
  if (notificationType && notificationType !== "All") {
    params.set("notification_type", notificationType);
  }

  const query = params.toString();
  return query ? `${baseEndpoint}?${query}` : baseEndpoint;
}

export async function fetchNotifications({ page, limit, notificationType }) {
  if (!AUTH_TOKEN) {
    throw new Error("Missing VITE_AFFORDMED_AUTH_TOKEN in .env");
  }

  const errors = [];
  const variants = [{ includePaging: true }, { includePaging: false }];

  for (const endpoint of NOTIFICATIONS_ENDPOINTS) {
    for (const variant of variants) {
      const url = buildUrl(endpoint, {
        page,
        limit,
        notificationType,
        includePaging: variant.includePaging
      });

      try {
        const data = await requestWithAuth(url, AUTH_TOKEN);
        return data.notifications || [];
      } catch (error) {
        errors.push(error.message);
      }
    }
  }

  throw new Error(errors[errors.length - 1] || "Notification API unavailable");
}

export async function fetchManyNotifications({
  maxPages = 10,
  limit = 25,
  notificationType = "All"
}) {
  const all = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const pageData = await fetchNotifications({ page, limit, notificationType });
    all.push(...pageData);
    if (pageData.length < limit) {
      break;
    }
  }

  return all;
}
