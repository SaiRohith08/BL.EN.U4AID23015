import {
  Card,
  CardActionArea,
  Chip,
  Stack,
  Typography
} from "@mui/material";

const typeColor = {
  Placement: "success",
  Result: "warning",
  Event: "info"
};

export default function NotificationCard({ item, isViewed, onClick }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: isViewed ? "divider" : "primary.main",
        backgroundColor: isViewed ? "white" : "rgba(21, 101, 192, 0.06)"
      }}
    >
      <CardActionArea onClick={onClick} sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Chip
              label={item.Type}
              color={typeColor[item.Type] || "default"}
              size="small"
            />
            <Chip
              label={isViewed ? "Viewed" : "New"}
              color={isViewed ? "default" : "secondary"}
              size="small"
            />
          </Stack>
          <Typography variant="body1" fontWeight={600}>
            {item.Message}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.Timestamp}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
