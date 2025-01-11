import { useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import {
  Navbar,
  SettingsDialog,
  ColumnGrid,
  EmptyState,
  ShareDialog,
  ConfirmationDialog,
} from "../../components";
import { useEffect } from "react";
import { decodeData } from "../../utils/base64";
import { useTranslation } from "react-i18next";

function ToDoApp() {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem("columns");
    return savedColumns ? JSON.parse(savedColumns) : [];
  });

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    checkDataInUrl();
  }, []);

  const updateColumn = (id, updatedColumn) => {
    setColumns(
      columns.map((column) => (column.id === id ? updatedColumn : column))
    );
  };

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
      setColumns(decodedData);
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
      <Navbar
        onSettingsClick={() => setSettingsDialogOpen(true)}
        onShareClick={() => setShareDialogOpen(true)}
        canShare={Boolean(columns?.length)}
      />

      <ConfirmationDialog
        open={importDialogOpen}
        title={t("share.importTitle")}
        description={t("share.importDescription")}
        onCancel={() => handleImportDialogClose(false)}
        onConfirm={() => handleImportDialogClose(true)}
      />

      <Box p={4}>
        <SettingsDialog
          open={settingsDialogOpen}
          onClose={() => setSettingsDialogOpen(false)}
          columns={columns}
          setColumns={setColumns}
        />

        <ShareDialog
          data={columns}
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
        />

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
