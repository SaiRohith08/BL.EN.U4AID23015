const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1
};

function getTimestampMs(timestamp) {
  return new Date(timestamp.replace(" ", "T") + "Z").getTime();
}

export function computePriorityScore(notification) {
  const weight = TYPE_WEIGHT[notification.Type] || 0;
  return weight * 1e13 + getTimestampMs(notification.Timestamp);
}

export function getTopNPriorityNotifications(notifications, n = 10) {
  return [...notifications]
    .sort((a, b) => computePriorityScore(b) - computePriorityScore(a))
    .slice(0, n);
}
