import {
  Container,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { availableLanguages } from "../../../utils";

function Language() {
  const { t, ready, i18n } = useTranslation();

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <Container disableGutters>
      <Box>
        <FormControl fullWidth variant="outlined">
          <InputLabel>{t("settingsDialog.language")}</InputLabel>
          <Select
            value={i18n.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            label={t("settingsDialog.language")}
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
            }}
          >
            {availableLanguages.map((language) => (
              <MenuItem key={language.code} value={language.code}>
                {language.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Typography variant="body2" sx={{ marginTop: 2, color: "gray" }}>
        {t("settingsDialog.languagePreference")}
      </Typography>
    </Container>
  );
}

export default Language;
