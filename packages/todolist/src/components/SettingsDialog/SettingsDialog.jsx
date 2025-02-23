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
import Stats from "./Stats";

function SettingsDialog({ open, onClose, columns, updateColumns }) {
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
              content: (
                <Columns columns={columns} updateColumns={updateColumns} />
              ),
              label: t("settingsDialog.columns"),
            },
            {
              content: <Language />,
              label: t("settingsDialog.language"),
            },
            {
              content: <Stats columns={columns} />,
              label: t("settingsDialog.stats"),
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
  updateColumns: PropTypes.func,
};
