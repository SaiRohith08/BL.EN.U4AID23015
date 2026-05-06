# Notification System Design

## Stage 1

### Problem

Users receive many notifications and may miss important ones. We need a Priority Inbox that always shows top 10 most important unread notifications. Priority depends on:

1. Type importance (`Placement > Result > Event`)
2. Recency (newer notifications are higher within same type)

### Stage 1 approach

1. Fetch notifications from protected endpoint:
   - `GET /evaluation-service/notifications`
   - Auth via bearer token
2. For each notification, compute a single sortable score:
   - `priorityScore = typeWeight * LARGE_CONSTANT + timestampEpoch`
3. Maintain only top 10 while iterating over all notifications:
   - Keep an array of at most 10 items
   - If new item is better than current minimum, replace minimum
4. Sort final top 10 in descending priority before output.

### Why this is efficient

- Let `m` be number of notifications and `n=10`.
- Runtime: `O(m * n log n)` with this compact implementation; since `n` is constant (10), this is effectively linear in `m`.
- Space: `O(n)` extra space for the top list.

### How to maintain top 10 as new notifications arrive

- For each incoming notification event:
  1. Compute its score
  2. Compare with current minimum in top 10
  3. Insert/replace only if better
- This avoids recomputing over full history and keeps updates fast.

### Logging strategy

Using the reusable `logging_middleware` package:

- `info` log when Stage 1 run starts
- `info` log for fetched count
- `info` log when top 10 is computed
- `error` log if API fetch or processing fails

This gives traceability for both successful and failed execution paths.

## Stage 2

### Frontend architecture

- Stack: React + Vite + Material UI.
- Router structure:
  - `/` -> All Notifications page
  - `/priority` -> Priority Inbox page
- State layers:
  - API query state (`page`, `limit`, `notification_type`)
  - View-state (`viewed IDs`) persisted in localStorage
  - Priority controls (`top n`, type filter)

### API usage

- All Notifications page uses server query parameters directly:
  - `page`
  - `limit`
  - `notification_type`
- Priority page fetches paginated notifications and computes top `n` client-side using:
  - Type weight (`Placement > Result > Event`)
  - Recency (latest timestamp first)

### Viewed vs new notifications

- Each notification card click marks the notification as viewed.
- Viewed IDs are stored in localStorage (`viewed_notification_ids`).
- UI chip displays `New` or `Viewed` state for every notification.

### Logging strategy (frontend)

- Non-blocking logs are emitted for:
  - page fetch start
  - fetch failures
  - major user-driven data transitions
- Log payload follows required schema:
  - `stack: "frontend"`
  - valid `level`
  - valid `package` (`page`, `api`, `component`, etc.)
  - descriptive message

### Responsiveness

- Material UI layout uses responsive stacks and grid cards.
- Tested layout targets desktop and mobile widths on `http://localhost:3000`.
