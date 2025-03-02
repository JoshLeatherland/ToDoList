import PropTypes from "prop-types";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks";

function Navbar({ displayName = "ToDo", onSettingsClick, canShare }) {
  const { t, ready } = useTranslation();

  const { isAuthenticated } = useAuth();

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
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
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

Navbar.propTypes = {
  displayName: PropTypes.string,
  onSettingsClick: PropTypes.func,
  canShare: PropTypes.bool,
};
