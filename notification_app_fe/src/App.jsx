import { Link, Route, Routes, useLocation } from "react-router-dom";
import { AppBar, Box, Button, Chip, Container, Stack, Toolbar, Typography } from "@mui/material";
import AllNotificationsPage from "./pages/AllNotificationsPage";
import PriorityNotificationsPage from "./pages/PriorityNotificationsPage";
import { useViewedNotifications } from "./hooks/useViewedNotifications";

function NavButton({ to, label }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Button
      component={Link}
      to={to}
      variant={active ? "contained" : "outlined"}
      size="small"
    >
      {label}
    </Button>
  );
}

export default function App() {
  const { viewedIds, markViewed } = useViewedNotifications();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <Typography variant="h6" fontWeight={700}>
            Campus Notifications
          </Typography>
          <Stack direction="row" spacing={1}>
            <NavButton to="/" label="All Notifications" />
            <NavButton to="/priority" label="Priority Inbox" />
          </Stack>
          <Chip label={`Viewed: ${viewedIds.size}`} color="secondary" size="small" />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Routes>
          <Route
            path="/"
            element={<AllNotificationsPage viewedIds={viewedIds} markViewed={markViewed} />}
          />
          <Route
            path="/priority"
            element={<PriorityNotificationsPage viewedIds={viewedIds} markViewed={markViewed} />}
          />
        </Routes>
      </Container>
    </Box>
  );
}
