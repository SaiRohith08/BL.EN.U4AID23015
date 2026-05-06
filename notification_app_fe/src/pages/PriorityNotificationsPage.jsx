import { useEffect, useMemo, useState } from "react";
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
import { fetchManyNotifications } from "../api/notifications";
import { getTopNPriorityNotifications } from "../utils/priority";
import { Log } from "../utils/logger";

const types = ["All", "Event", "Result", "Placement"];

export default function PriorityNotificationsPage({ viewedIds, markViewed }) {
  const [notificationType, setNotificationType] = useState("All");
  const [topN, setTopN] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    async function loadPriorityData() {
      setLoading(true);
      setError("");
      try {
        await Log("frontend", "info", "page", `Load priority page type=${notificationType}`);
        const data = await fetchManyNotifications({
          maxPages: 10,
          limit: 20,
          notificationType
        });
        setAllItems(data);
      } catch (loadError) {
        setError(loadError.message || "Failed to load priority notifications");
        await Log("frontend", "error", "api", `Priority fetch failed: ${loadError}`);
      } finally {
        setLoading(false);
      }
    }

    loadPriorityData();
  }, [notificationType]);

  const topItems = useMemo(
    () => getTopNPriorityNotifications(allItems, topN),
    [allItems, topN]
  );

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>
        Priority Notifications
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Sorted by type weight (Placement &gt; Result &gt; Event), then recency.
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type Filter</InputLabel>
          <Select
            value={notificationType}
            label="Type Filter"
            onChange={(event) => setNotificationType(event.target.value)}
          >
            {types.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Top N</InputLabel>
          <Select value={topN} label="Top N" onChange={(event) => setTopN(Number(event.target.value))}>
            {[5, 10, 15, 20].map((n) => (
              <MenuItem key={n} value={n}>
                {n}
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
        <NotificationList items={topItems} viewedIds={viewedIds} onOpen={markViewed} />
      )}
    </Stack>
  );
}
