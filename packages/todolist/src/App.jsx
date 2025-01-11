import { theme, ToDoApp } from "./components";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { ThemeProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n, ready } = useTranslation();
  const [locale, setLocale] = useState(i18n.language || "en-gb");

  useEffect(() => {
    // Dynamically update the locale when `i18n.language` changes
    setLocale(i18n.language.toLocaleLowerCase());
    dayjs.locale(i18n.language.toLocaleLowerCase());
  }, [i18n.language]);

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <ThemeProvider theme={theme}>
        <ToDoApp />
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
