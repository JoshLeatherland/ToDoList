import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { TabContainer } from "../../components";
import { useTheme } from "@emotion/react";
import Language from "./Language";
import Columns from "./Columns";

function SettingsDialog({ open, onClose, columns, setColumns }) {
  const { t, ready } = useTranslation();

  if (!ready) return <div>{t("shared.loading")}</div>;

  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{t("settingsDialog.title")}:</DialogTitle>
      <DialogContent>
        <TabContainer
          orientation="horizontal"
          tabs={[
            {
              content: <Columns columns={columns} setColumns={setColumns} />,
              label: t("settingsDialog.columns"),
            },
            {
              content: <Language />,
              label: t("settingsDialog.language"),
            },
          ]}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {t("shared.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SettingsDialog;

SettingsDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  columns: PropTypes.array,
  setColumns: PropTypes.func,
};
