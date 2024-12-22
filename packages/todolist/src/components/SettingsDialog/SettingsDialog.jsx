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

function ColumnAddDialog({
  open,
  onClose,
  newColumnName,
  onColumnNameChange,
  onAddColumn,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Settings:</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Manage Columns:
        </Typography>
        <TextField
          label="New Column"
          variant="outlined"
          fullWidth
          value={newColumnName}
          onChange={onColumnNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onAddColumn} color="primary">
          Add Column
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
