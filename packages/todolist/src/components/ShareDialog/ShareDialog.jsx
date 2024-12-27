import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Box,
  Alert,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { encodeData } from "../../utils/base64";
import { copyToClipboard } from "../../utils/clipboard";
import { useTranslation } from "react-i18next";

function ShareScreen({ data, open, onClose }) {
  const [shareUrl, setShareUrl] = useState("");

  const generateShareUrl = () => {
    const encodedData = encodeData(data);
    const pathname = window.location.pathname;
    const baseUrl = pathname
      ? `${window.location.origin}${pathname}`
      : window.location.origin;
    const url = `${baseUrl}?data=${encodedData}`;
    setShareUrl(url);
  };

  useEffect(() => {
    if (open) {
      generateShareUrl();
    }
  }, [open]);

  const { t, ready } = useTranslation();

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{t("share.title")}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          {t("share.description")}
        </Typography>
        <Alert severity="info" sx={{ marginBottom: 2, marginTop: 2 }}>
          {t("share.notice")}
        </Alert>
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            label={t("share.shareableUrl")}
            variant="outlined"
            fullWidth
            value={shareUrl}
            InputProps={{
              readOnly: true,
            }}
            margin="normal"
          />
          <IconButton
            onClick={() => copyToClipboard(shareUrl)}
            color="primary"
            style={{ marginLeft: 10 }}
          >
            <ContentCopy />
          </IconButton>
        </Box>
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ marginTop: 5 }}
        >
          {t("share.copy")}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {t("shared.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShareScreen;
