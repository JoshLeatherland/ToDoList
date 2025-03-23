import { Grid2 } from "@mui/material";
import PropTypes from "prop-types";
import Column from "../Column";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

function ColumnGrid({ columns, updateColumn, onDragEnd }) {
  return (
    <Grid2 container spacing={2}>
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <Grid2
                size={{ xs: 12, sm: 6, md: 4, xl: 3 }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <Column column={column} updateColumn={updateColumn} />
                {provided.placeholder}
              </Grid2>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </Grid2>
  );
}

ColumnGrid.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      tasks: PropTypes.array, // optional, will default to an empty array if undefined
    })
  ).isRequired,
  updateColumn: PropTypes.func.isRequired,
};

export default ColumnGrid;
