import PropTypes from "prop-types";
import { useState } from "react";
import { Button, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import ListColumns from "../ListColumns";
import { InputDialog } from "../../../components";

function Columns({ columns, setColumns }) {
  const [inputDialogOpen, setInputDialogOpen] = useState(false);

  const { t, ready } = useTranslation();

  const addColumn = (columnName) => {
    if (columnName.trim() === "") return;
    setColumns([...columns, { id: Date.now(), name: columnName, tasks: [] }]);
    setInputDialogOpen(false);
  };

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setInputDialogOpen(true)}
        >
          {t("shared.add")}
        </Button>
      </Box>

      <ListColumns columns={columns} setColumns={setColumns} />

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
    </>
  );
}

export default Columns;

Columns.propTypes = {
  columns: PropTypes.array,
  setColumns: PropTypes.func,
};
