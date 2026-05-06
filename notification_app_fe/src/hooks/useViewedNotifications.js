import { useMemo, useState } from "react";

const STORAGE_KEY = "viewed_notification_ids";

function readViewedSet() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return new Set();
  }

  try {
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

export function useViewedNotifications() {
  const [viewedSet, setViewedSet] = useState(() => readViewedSet());

  const viewedIds = useMemo(() => viewedSet, [viewedSet]);

  function markViewed(id) {
    setViewedSet((previous) => {
      if (previous.has(id)) {
        return previous;
      }

      const next = new Set(previous);
      next.add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  }

  return { viewedIds, markViewed };
}
