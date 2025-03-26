import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Home } from "@mui/icons-material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ConfirmationDialog } from "../../components";
import LogoutIcon from "@mui/icons-material/Logout";

function Sidebar({ open, setOpen, onLogout }) {
  const theme = useTheme();
  //const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { t, ready } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!ready) return <div>{t("shared.loading")}</div>;

  const handleNavigate = (route) => {
    navigate(route);

    //if (isMobile) setOpen(false); // auto-close on mobile, but decided to do it on all
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          width: open ? 240 : 60,
          transition: "width 0.3s",
          backgroundColor: "primary.main",
          color: "white",
          overflowX: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigate("/")}>
              <ListItemIcon
                sx={{ color: "white", minWidth: open ? "40px" : "auto" }}
              >
                <Home />
              </ListItemIcon>
              {open && <ListItemText primary={t("sidebar.home")} />}
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigate("/columns")}>
              <ListItemIcon
                sx={{ color: "white", minWidth: open ? "40px" : "auto" }}
              >
                <ViewColumnIcon />
              </ListItemIcon>
              {open && <ListItemText primary={t("sidebar.columns")} />}
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigate("/stats")}>
              <ListItemIcon
                sx={{ color: "white", minWidth: open ? "40px" : "auto" }}
              >
                <AnalyticsIcon />
              </ListItemIcon>
              {open && <ListItemText primary={t("sidebar.stats")} />}
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => setDialogOpen(true)}>
              <ListItemIcon
                sx={{ color: "white", minWidth: open ? "40px" : "auto" }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {open && <ListItemText primary={t("sidebar.logout")} />}
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <ConfirmationDialog
        open={dialogOpen}
        title={t("dialogs.logout.title")}
        description={t("dialogs.logout.description")}
        onCancel={() => setDialogOpen(false)}
        onConfirm={async () => {
          setDialogOpen(false);
          await onLogout();
        }}
      />
    </Box>
  );
}

export default Sidebar;
