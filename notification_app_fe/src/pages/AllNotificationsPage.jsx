import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from "@mui/material";
import NotificationList from "../components/NotificationList";
import { fetchNotifications } from "../api/notifications";
import { Log } from "../utils/logger";

const types = ["All", "Event", "Result", "Placement"];

export default function AllNotificationsPage({ viewedIds, markViewed }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [notificationType, setNotificationType] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadNotifications() {
      setLoading(true);
      setError("");

      try {
        await Log(
          "frontend",
          "info",
          "page",
          `Load notifications page=${page} limit=${limit} type=${notificationType}`
        );

        const data = await fetchNotifications({ page, limit, notificationType });
        setItems(data);
      } catch (loadError) {
        setError(loadError.message || "Failed to load notifications");
        await Log("frontend", "error", "api", `Notification fetch failed: ${loadError}`);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, [page, limit, notificationType]);

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>
        All Notifications
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={notificationType}
            label="Type"
            onChange={(event) => {
              setPage(1);
              setNotificationType(event.target.value);
            }}
          >
            {types.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Limit</InputLabel>
          <Select
            value={limit}
            label="Limit"
            onChange={(event) => {
              setPage(1);
              setLimit(Number(event.target.value));
            }}
          >
            {[5, 10, 15, 20].map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Page</InputLabel>
          <Select value={page} label="Page" onChange={(event) => setPage(Number(event.target.value))}>
            {[1, 2, 3, 4, 5].map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <NotificationList items={items} viewedIds={viewedIds} onOpen={markViewed} />
      )}
    </Stack>
  );
}
