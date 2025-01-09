import PropTypes from "prop-types";
import { Box, IconButton, Typography, Paper, Container } from "@mui/material";
import { useTheme } from "@emotion/react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ConfirmationDialog, InputDialog } from "../../../components";

function ListColumns({ columns = [], setColumns }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState({});
  const [selectedColumnEdit, setSelectedColumnEdit] = useState(null);

  const theme = useTheme();

  const { t, ready } = useTranslation();

  const deleteColumn = (id) => {
    setColumns(columns.filter((column) => column.id !== id));
    setShowDeleteDialog(false);
  };

  const handleEditColumn = (newName) => {
    if (selectedColumnEdit && newName.trim() !== "") {
      setColumns(
        columns.map((column) =>
          column.id === selectedColumnEdit.id
            ? { ...column, name: newName }
            : column
        )
      );
    }
    setSelectedColumnEdit(null);
  };

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <>
      <Container disableGutters sx={{ mt: 2 }}>
        {columns.length > 0 ? (
          columns.map((column, index) => (
            <div key={index}>
              <Paper
                elevation={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 16px",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  boxShadow: 0,
                  backgroundColor: theme.palette.tasks?.active,
                }}
              >
                <Box flexGrow={1} ml={2}>
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: "none",
                      color: theme.palette.tasks?.text?.active,
                    }}
                  >
                    {column.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {t("column.taskCount", { tasks: column.tasks.length })}
                  </Typography>
                </Box>

                <Box>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => {
                      setSelectedColumnEdit(column);
                      console.log(column);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    size="small"
                    onClick={() => {
                      setSelectedColumn(column);
                      setShowDeleteDialog(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            </div>
          ))
        ) : (
          <Box
            sx={{
              backgroundColor: theme.palette.tasks?.active,
              width: "100%",
              padding: "1em",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "1em",
            }}
          >
            <Typography sx={{ textAlign: "center" }}>
              {t("column.noColumns")}
            </Typography>
          </Box>
        )}
      </Container>

      <ConfirmationDialog
        open={showDeleteDialog}
        title={t("column.deleteTitle")}
        description={t("column.deleteDescription")}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={() => deleteColumn(selectedColumn.id)}
      />

      {selectedColumnEdit && (
        <InputDialog
          open={Boolean(selectedColumnEdit)}
          title={t("column.edit")}
          label={t("column.name")}
          initialValue={selectedColumnEdit?.name}
          onConfirm={(val) => handleEditColumn(val)}
          onClose={() => setSelectedColumnEdit(null)}
        />
      )}
    </>
  );
}

export default ListColumns;

ListColumns.propTypes = {
  columns: PropTypes.array,
  setColumns: PropTypes.func,
};
