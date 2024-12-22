import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function ColumnAddDialog({
  open,
  onClose,
  newColumnName,
  onColumnNameChange,
  onAddColumn,
}) {
  const { t, ready } = useTranslation();

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{t("settingsDialog.title")}:</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          {t("settingsDialog.columnHeading")}:
        </Typography>
        <TextField
          label={t("settingsDialog.newColumn")}
          variant="outlined"
          fullWidth
          value={newColumnName}
          onChange={onColumnNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {t("shared.cancel")}
        </Button>
        <Button onClick={onAddColumn} color="primary">
          {t("shared.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ColumnAddDialog;

ColumnAddDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  newColumnName: PropTypes.string,
  onColumnNameChange: PropTypes.func,
  onAddColumn: PropTypes.func,
};
