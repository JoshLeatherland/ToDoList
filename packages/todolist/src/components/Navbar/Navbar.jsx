import PropTypes from "prop-types";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks";
import { useState } from "react";
import { ConfirmationDialog } from "../../components";
import LogoutIcon from "@mui/icons-material/Logout";

function Navbar({ displayName = "ToDo", onSettingsClick, canShare }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t, ready } = useTranslation();

  const { isAuthenticated, logout } = useAuth();

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <>
      <AppBar position="sticky" color="primary" sx={{ boxShadow: 0 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
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
