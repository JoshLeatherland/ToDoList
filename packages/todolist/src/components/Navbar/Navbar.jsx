import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks";
import { useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import TranslateIcon from "@mui/icons-material/Translate";

function Navbar({ displayName = "ToDo", sidebarOpen, setSidebarOpen }) {
  const { t, ready, i18n } = useTranslation();

  const theme = useTheme();

  const { isAuthenticated } = useAuth();

  if (!ready) return <div>{t("shared.loading")}</div>;

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "de", name: "German" },
  ];

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const isValidLanguage = languages.some((lng) => lng.code === i18n.language);

    if (!isValidLanguage) {
      handleLanguageChange("en");
    }
  }, [i18n.language]);

  return (
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
        <FormControl variant="standard" mr={2}>
          <Select
            value={i18n.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            labelId="select-with-icon-label"
            startAdornment={
              <InputAdornment position="start">
                <TranslateIcon sx={{ color: "white" }} />
              </InputAdornment>
            }
            label=""
            sx={{
              color: "white",
              borderBottom: "1px solid white",
              "& .MuiSvgIcon-root": { color: "white" },
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: "#fff",
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            {languages.map((language) => (
              <MenuItem key={language.code} value={language.code}>
                {t(`languages.${language.code}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
