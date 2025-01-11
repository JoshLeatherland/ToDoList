import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { ConfirmationDialog, InputDialog } from "../../../components";
import SortableColumns from "./SortableColumns";

function ListColumns({ columns = [], setColumns }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState({});
  const [selectedColumnEdit, setSelectedColumnEdit] = useState(null);

  const { t, ready } = useTranslation();

  const deleteColumn = (id) => {
    setColumns(columns.filter((column) => column.id !== id));
    setShowDeleteDialog(false);
  };

  const handleEditColumn = (newName) => {
    if (selectedColumnEdit && newName.trim() !== "") {
      setColumns(
        columns.map((column) =>
          column.id === selectedColumnEdit.id
            ? { ...column, name: newName }
            : column
        )
      );
    }
    setSelectedColumnEdit(null);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return; // If dropped outside a valid droppable area, do nothing.

    const reorderedColumns = Array.from(columns);

    // Remove the dragged item from its original position.
    const [movedColumn] = reorderedColumns.splice(result.source.index, 1);

    // Insert the dragged item into its new position.
    reorderedColumns.splice(result.destination.index, 0, movedColumn);

    setColumns(reorderedColumns);
  };

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <SortableColumns
          columns={columns}
          setSelectedColumn={setSelectedColumn}
          setShowDeleteDialog={setShowDeleteDialog}
          setSelectedColumnEdit={setSelectedColumnEdit}
        />
      </DragDropContext>

      <ConfirmationDialog
        open={showDeleteDialog}
        title={t("column.deleteTitle")}
        description={t("column.deleteDescription")}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={() => deleteColumn(selectedColumn.id)}
      />

      {selectedColumnEdit && (
        <InputDialog
          open={Boolean(selectedColumnEdit)}
          title={t("column.edit")}
          label={t("column.name")}
          initialValue={selectedColumnEdit?.name}
          onConfirm={(val) => handleEditColumn(val)}
          onClose={() => setSelectedColumnEdit(null)}
        />
      )}
    </>
  );
}

export default ListColumns;

ListColumns.propTypes = {
  columns: PropTypes.array,
  setColumns: PropTypes.func,
};
