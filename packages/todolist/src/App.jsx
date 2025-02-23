import {
  theme,
  ToDoApp,
  Navbar,
  SettingsDialog,
  ShareDialog,
} from "./components";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { ThemeProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import { useBoard } from "./hooks";

function App() {
  const { t, i18n, ready } = useTranslation();
  const [locale, setLocale] = useState(i18n.language || "en-gb");
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  useEffect(() => {
    // Dynamically update the locale when `i18n.language` changes
    setLocale(i18n.language.toLocaleLowerCase());
    dayjs.locale(i18n.language.toLocaleLowerCase());
  }, [i18n.language]);

  const { columns, updateColumns, updateColumn } = useBoard();

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            backgroundColor: theme.palette.backgrounds.main,
          }}
        >
          <Navbar
            onSettingsClick={() => setSettingsDialogOpen(true)}
            onShareClick={() => setShareDialogOpen(true)}
            canShare={Boolean(columns?.length)}
          />

          <SettingsDialog
            open={settingsDialogOpen}
            onClose={() => setSettingsDialogOpen(false)}
            columns={columns}
            updateColumns={updateColumns}
          />

          <ShareDialog
            data={columns}
            open={shareDialogOpen}
            onClose={() => setShareDialogOpen(false)}
          />

          <ToDoApp
            columns={columns}
            updateColumns={updateColumns}
            updateColumn={updateColumn}
          />
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
