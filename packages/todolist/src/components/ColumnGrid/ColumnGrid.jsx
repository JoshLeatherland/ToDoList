import { Grid2 } from "@mui/material";
import PropTypes from "prop-types";
import Column from "../Column";

function ColumnGrid({ columns, updateColumn }) {
  return (
    <Grid2 container spacing={2}>
      {columns.map((column) => (
        <Grid2 item xs={12} sm={6} md={4} key={column.id}>
          <Column column={column} updateColumn={updateColumn} />
        </Grid2>
      ))}
    </Grid2>
  );
}

ColumnGrid.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  updateColumn: PropTypes.func.isRequired,
};

export default ColumnGrid;
