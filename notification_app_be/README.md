# notification_app_be

Stage 1 backend solution that fetches notifications from the protected API and prints top 10 by priority.

## Priority logic

- Type weight: `Placement > Result > Event`
- If two notifications have same type, newer timestamp wins

## Run

```bash
cd notification_app_be
export AFFORDMED_AUTH_TOKEN="<your_auth_token>"
npm start
```

## Output

The app prints:

```json
{
  "top10": []
}
```

Each item includes `ID`, `Type`, `Message`, and `Timestamp`.

## Logging integration

The app uses `../logging_middleware/src` and emits logs for:
- start of Stage 1 run
- notifications fetched count
- top 10 computation completion
- error path (if any)
