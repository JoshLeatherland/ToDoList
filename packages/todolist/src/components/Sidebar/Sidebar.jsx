import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Menu, Home, Assignment, AccessTime } from "@mui/icons-material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Sidebar({ open, setOpen }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { t, ready } = useTranslation();

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
        </List>
      </Box>
    </Box>
  );
}

export default Sidebar;
