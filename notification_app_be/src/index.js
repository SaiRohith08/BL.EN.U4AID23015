const { Log, initLogger } = require("../../logging_middleware/src");

const NOTIFICATION_API_URL =
  "http://20.207.122.201/evaluation-service/notifications";

const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1
};

function parseTimestamp(value) {
  // API format is "YYYY-MM-DD HH:mm:ss"; convert to a Date-safe ISO format.
  return new Date(value.replace(" ", "T") + "Z");
}

function computePriorityScore(notification) {
  const weight = TYPE_WEIGHT[notification.Type] || 0;
  const timestamp = parseTimestamp(notification.Timestamp).getTime();
  return weight * 1e13 + timestamp;
}

function comparePriority(a, b) {
  if (a.priorityScore !== b.priorityScore) {
    return a.priorityScore - b.priorityScore;
  }

  // Stable fallback in case of tie.
  return a.notification.ID.localeCompare(b.notification.ID);
}

function insertIntoTopN(topItems, candidate, n) {
  if (topItems.length < n) {
    topItems.push(candidate);
    topItems.sort(comparePriority);
    return;
  }

  if (comparePriority(candidate, topItems[0]) <= 0) {
    return;
  }

  topItems[0] = candidate;
  topItems.sort(comparePriority);
}

function getTopPriorityUnreadNotifications(notifications, n = 10) {
  const topItems = [];

  for (const notification of notifications) {
    const candidate = {
      notification,
      priorityScore: computePriorityScore(notification)
    };

    insertIntoTopN(topItems, candidate, n);
  }

  return topItems
    .sort((a, b) => comparePriority(b, a))
    .map((item) => item.notification);
}

async function fetchNotifications(token) {
  let response = await fetch(NOTIFICATION_API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  let data = await response.json().catch(() => ({}));

  // Fallback in case the API expects the raw token instead of Bearer format.
  if (response.status === 401) {
    response = await fetch(NOTIFICATION_API_URL, {
      method: "GET",
      headers: {
        Authorization: token
      }
    });
    data = await response.json().catch(() => ({}));
  }

  if (!response.ok) {
    throw new Error(
      `Notification API failed (${response.status}): ${
        data.message || "Unknown error"
      }`
    );
  }

  return data.notifications || [];
}

async function safeLog(level, packageName, message) {
  try {
    await Log("backend", level, packageName, message);
  } catch (error) {
    // Logging must never break business flow for Stage 1 output generation.
    console.warn(`Log skipped: ${error.message}`);
  }
}

async function runStage1() {
  const token = process.env.AFFORDMED_AUTH_TOKEN;

  if (!token) {
    throw new Error("Set AFFORDMED_AUTH_TOKEN before running Stage 1.");
  }

  initLogger({ token });

  await safeLog("info", "service", "Stage 1 execution started: fetching notifications");

  const notifications = await fetchNotifications(token);

  await safeLog(
    "info",
    "service",
    `Fetched ${notifications.length} notifications from protected API`
  );

  const top10 = getTopPriorityUnreadNotifications(notifications, 10);

  await safeLog("info", "service", `Computed top ${top10.length} priority notifications`);

  console.log(JSON.stringify({ top10 }, null, 2));
}

if (require.main === module) {
  runStage1().catch(async (error) => {
    console.error("Stage 1 failed:", error.message);

    try {
      if (process.env.AFFORDMED_AUTH_TOKEN) {
        initLogger({ token: process.env.AFFORDMED_AUTH_TOKEN });
        await safeLog("error", "handler", `Stage 1 failed: ${error.message}`);
      }
    } catch (logError) {
      console.error("Failed to write error log:", logError.message);
    }

    process.exitCode = 1;
  });
}

module.exports = {
  runStage1,
  getTopPriorityUnreadNotifications,
  computePriorityScore
};
