import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function EmptyState() {
  const { t, ready } = useTranslation();

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <Box
      sx={{
        textAlign: "center",
        marginTop: 4,
        color: "text.secondary",
        lineHeight: 1.6,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {t("emptyState.title")}
      </Typography>
      <Typography>{t("emptyState.getStarted")}</Typography>

      <Typography sx={{ marginY: 2 }}>{t("emptyState.or")}</Typography>

      <Typography>
        {t("emptyState.explore")}{" "}
        <a
          href="https://github.com/JoshLeatherland/ToDoList/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
          }}
        >
          {t("emptyState.github")}.
        </a>
      </Typography>
    </Box>
  );
}

export default EmptyState;
