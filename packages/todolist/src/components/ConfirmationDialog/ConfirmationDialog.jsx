import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const ConfirmationDialog = ({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}) => {
  const { t, ready } = useTranslation();

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          {t("shared.cancel")}
        </Button>
        <Button onClick={onConfirm} color="primary">
          {t("shared.yes")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

ConfirmationDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};
