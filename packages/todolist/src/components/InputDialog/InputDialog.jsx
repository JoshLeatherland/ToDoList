import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function TextInputDialog({
  open,
  title,
  label,
  placeholder,
  initialValue = "",
  onConfirm,
  onClose,
}) {
  const [inputValue, setInputValue] = useState(initialValue);

  const { t, ready } = useTranslation();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleConfirm = () => {
    onConfirm(inputValue);
    setInputValue("");
  };

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="text-input-dialog-title"
      PaperProps={{
        sx: { minWidth: "400px" },
      }}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle id="text-input-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label={label}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          variant="outlined"
          margin="normal"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleConfirm();
            }
          }}
        />
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {t("shared.cancel")}
        </Button>
        <Button onClick={handleConfirm} color="primary">
          {t("shared.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TextInputDialog;

TextInputDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  initialValue: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
