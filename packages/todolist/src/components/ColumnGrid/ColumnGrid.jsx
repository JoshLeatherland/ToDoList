import { Grid2 } from "@mui/material";
import PropTypes from "prop-types";
import Column from "../Column";

function ColumnGrid({ columns, updateColumn }) {
  return (
    <Grid2 container spacing={2}>
      {columns.map((column, index) => (
        <Grid2 size={{ xs: 12, sm: 6, md: 4, xl: 3 }} key={column.id}>
          <Column
            column={{ ...column, tasks: column.tasks || [] }}
            updateColumn={updateColumn}
            columnIndex={index}
          />
        </Grid2>
      ))}
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
