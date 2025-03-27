import PropTypes from "prop-types";
import { useState } from "react";
import { Button, Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ListColumns from "../ListColumns";
import { InputDialog } from "../../../components";

function Columns({ columns, updateColumns }) {
  const [inputDialogOpen, setInputDialogOpen] = useState(false);

  const { t, ready } = useTranslation();

  const addColumn = (columnName) => {
    if (columnName.trim() === "") return;
    updateColumns([
      ...columns,
      { id: String(Date.now()), name: columnName, tasks: [] },
    ]);
    setInputDialogOpen(false);
  };

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <Container sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="fontWeightBold">
          {t("manageColumns.title")}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setInputDialogOpen(true)}
        >
          {t("shared.add")}
        </Button>
      </Box>

      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        {t("manageColumns.description")}
      </Typography>

      <ListColumns columns={columns} updateColumns={updateColumns} />

      <InputDialog
        title={t("column.add")}
        label={t("column.name")}
        open={inputDialogOpen}
        onClose={() => {
          setInputDialogOpen(false);
        }}
        onConfirm={(val) => {
          addColumn(val);
        }}
      />
    </Container>
  );
}

export default Columns;

Columns.propTypes = {
  columns: PropTypes.array,
  updateColumns: PropTypes.func,
};
