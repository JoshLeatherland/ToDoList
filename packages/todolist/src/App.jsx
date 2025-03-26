import {
  theme,
  ToDoApp,
  Navbar,
  SettingsDialog,
  Auth,
  Loader,
  Sidebar,
  Columns,
  Stats,
} from "./components";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { ThemeProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import { useAuth, useBoard } from "./hooks";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useEnv } from "./contexts";

function App() {
  const { t, i18n, ready } = useTranslation();
  const [locale, setLocale] = useState(i18n.language || "en-gb");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Dynamically update the locale when `i18n.language` changes
    setLocale(i18n.language.toLocaleLowerCase());
    dayjs.locale(i18n.language.toLocaleLowerCase());
  }, [i18n.language]);

  const { apiUrl } = useEnv();
  const { isAuthenticated, logout } = useAuth();

  const { columns, updateColumns, updateColumn, loading, onDragEnd } = useBoard(
    {
      apiUrl: apiUrl,
      enabled: isAuthenticated,
    }
  );

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            height: "100vh",
            backgroundColor: theme.palette.backgrounds.main,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Loader open={loading} />

          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <Box sx={{ display: "flex", flex: 1 }}>
            {isAuthenticated && (
              <Sidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
                onLogout={logout}
              />
            )}

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
              }}
            >
              <Routes>
                <Route path="/auth" element={<Auth />} />

                <Route element={<ProtectedRoute />}>
                  <Route
                    path="/"
                    element={
                      <ToDoApp
                        columns={columns}
                        updateColumns={updateColumns}
                        updateColumn={updateColumn}
                        onDragEnd={onDragEnd}
                      />
                    }
                  />

                  <Route
                    path="/columns"
                    element={
                      <Columns
                        columns={columns}
                        updateColumns={updateColumns}
                      />
                    }
                  />

                  <Route path="/stats" element={<Stats columns={columns} />} />
                </Route>
              </Routes>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
