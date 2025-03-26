import PropTypes from "prop-types";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks";
import { useState } from "react";
import { ConfirmationDialog } from "../../components";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

function Navbar({
  displayName = "ToDo",
  onSettingsClick,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t, ready } = useTranslation();

  const { isAuthenticated, logout } = useAuth();

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <>
      <AppBar position="sticky" sx={{ boxShadow: 0 }} elevation={0}>
        <Toolbar>
          {isAuthenticated && (
            <IconButton
              sx={{ ml: 0, pl: 0 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              color="inherit"
            >
              {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
            {displayName === "ToDo"
              ? t("shared.defaultApplicationName")
              : displayName}
          </Typography>
          {isAuthenticated && (
            <>
              <IconButton color="inherit" onClick={onSettingsClick}>
                <Settings />
              </IconButton>

              <IconButton
                color="inherit"
                onClick={() => setDialogOpen(true)}
                ml={2}
              >
                <LogoutIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      <ConfirmationDialog
        open={dialogOpen}
        title={t("dialogs.logout.title")}
        description={t("dialogs.logout.description")}
        onCancel={() => setDialogOpen(false)}
        onConfirm={async () => {
          setDialogOpen(false);
          await logout();
        }}
      />
    </>
  );
}

export default Navbar;

Navbar.propTypes = {
  displayName: PropTypes.string,
  onSettingsClick: PropTypes.func,
  canShare: PropTypes.bool,
};
