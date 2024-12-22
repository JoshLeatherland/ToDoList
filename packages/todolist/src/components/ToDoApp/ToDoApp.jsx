import React, { useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import {
  Navbar,
  SettingsDialog,
  ColumnGrid,
  EmptyState,
} from "../../components";
import { useEffect } from "react";

function ToDoApp() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem("columns");
    return savedColumns ? JSON.parse(savedColumns) : [];
  });

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  const addColumn = () => {
    if (newColumnName.trim() === "") return;
    setColumns([
      ...columns,
      { id: Date.now(), name: newColumnName, tasks: [] },
    ]);
    setNewColumnName("");
    setDialogOpen(false);
  };

  const updateColumn = (id, updatedColumn) => {
    setColumns(
      columns.map((column) => (column.id === id ? updatedColumn : column))
    );
  };

  const deleteColumn = (id) => {
    setColumns(columns.filter((column) => column.id !== id));
  };

  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.backgrounds.main,
      }}
    >
      <Navbar onSettingsClick={() => setDialogOpen(true)} />

      <Box p={4}>
        <SettingsDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          newColumnName={newColumnName}
          onColumnNameChange={(e) => setNewColumnName(e.target.value)}
          onAddColumn={addColumn}
        />

        {columns.length > 0 ? (
          <ColumnGrid
            columns={columns}
            updateColumn={updateColumn}
            deleteColumn={deleteColumn}
          />
        ) : (
          <EmptyState />
        )}
      </Box>
    </Box>
  );
}

export default ToDoApp;
