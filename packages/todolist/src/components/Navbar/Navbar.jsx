import PropTypes from "prop-types";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Settings } from "@mui/icons-material";

function Navbar({ displayName = "ToDo", onSettingsClick }) {
  return (
    <AppBar position="sticky" color="primary" sx={{ boxShadow: 0 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {displayName}
        </Typography>
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
};
