import { useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import { ColumnGrid, EmptyState, ConfirmationDialog } from "../../components";
import { useEffect } from "react";
import { decodeData } from "../../utils/base64";
import { useTranslation } from "react-i18next";

function ToDoApp({ columns, updateColumns, updateColumn }) {
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  useEffect(() => {
    checkDataInUrl();
  }, []);

  const checkDataInUrl = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const encodedData = queryParams.get("data");

    if (encodedData) {
      setImportDialogOpen(true);
    }
  };

  const importDataFromUrl = (encodedData) => {
    try {
      const decodedData = decodeData(encodedData);
      updateColumns(decodedData);
    } catch (error) {
      console.error("Error decoding data:", error);
    }
  };

  const handleImportDialogClose = (importData) => {
    if (importData) {
      const queryParams = new URLSearchParams(window.location.search);
      const encodedData = queryParams.get("data");
      if (encodedData) {
        importDataFromUrl(encodedData);
      }
    }

    setImportDialogOpen(false);
    removeDataFromUrl();
  };

  const removeDataFromUrl = () => {
    const url = new URL(window.location);
    url.searchParams.delete("data");
    window.history.replaceState({}, "", url);
  };

  const theme = useTheme();

  const { t, ready } = useTranslation();

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.backgrounds.main,
      }}
    >
      <ConfirmationDialog
        open={importDialogOpen}
        title={t("share.importTitle")}
        description={t("share.importDescription")}
        onCancel={() => handleImportDialogClose(false)}
        onConfirm={() => handleImportDialogClose(true)}
      />

      <Box p={4}>
        {columns.length > 0 ? (
          <ColumnGrid columns={columns} updateColumn={updateColumn} />
        ) : (
          <EmptyState />
        )}
      </Box>
    </Box>
  );
}

export default ToDoApp;
