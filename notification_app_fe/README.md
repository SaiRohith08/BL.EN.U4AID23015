# notification_app_fe

Stage 2 React frontend for the Campus Notifications task.

## Features

- Runs on `http://localhost:3000`
- Material UI based responsive UI
- Two pages:
  - All Notifications (paginated with query params: `page`, `limit`, `notification_type`)
  - Priority Inbox (top `n` notifications sorted by weight + recency)
- View tracking (new vs viewed) using localStorage
- Frontend logging utility for protected `/logs` API

## Setup

```bash
cd notification_app_fe
cp .env.example .env
```

Edit `.env` and set:

```env
VITE_AFFORDMED_AUTH_TOKEN=your_real_access_token
```

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
