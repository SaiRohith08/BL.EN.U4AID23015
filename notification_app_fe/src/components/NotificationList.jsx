import { Grid, Typography } from "@mui/material";
import NotificationCard from "./NotificationCard";

export default function NotificationList({ items, viewedIds, onOpen }) {
  if (!items.length) {
    return <Typography color="text.secondary">No notifications found.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid size={{ xs: 12, md: 6 }} key={item.ID}>
          <NotificationCard
            item={item}
            isViewed={viewedIds.has(item.ID)}
            onClick={() => onOpen(item.ID)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
