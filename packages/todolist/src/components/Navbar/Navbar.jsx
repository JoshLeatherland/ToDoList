import PropTypes from "prop-types";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Settings } from "@mui/icons-material";
import ShareIcon from "@mui/icons-material/Share";
import { useTranslation } from "react-i18next";

function Navbar({
  displayName = "ToDo",
  onSettingsClick,
  onShareClick,
  canShare,
}) {
  const { t, ready } = useTranslation();

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <AppBar position="sticky" color="primary" sx={{ boxShadow: 0 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {displayName === "ToDo"
            ? t("shared.defaultApplicationName")
            : displayName}
        </Typography>
        {canShare && (
          <IconButton color="inherit" onClick={onShareClick}>
            <ShareIcon />
          </IconButton>
        )}
        <IconButton color="inherit" onClick={onSettingsClick}>
          <Settings />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

Navbar.propTypes = {
  displayName: PropTypes.string,
  onSettingsClick: PropTypes.func,
  onShareClick: PropTypes.func,
  canShare: PropTypes.bool,
};
