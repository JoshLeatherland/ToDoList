import React from "react";
import { Grid } from "@mui/material";
import Column from "../Column";

function ColumnGrid({ columns, updateColumn, deleteColumn }) {
  return (
    <Grid container spacing={2}>
      {columns.map((column) => (
        <Grid item xs={12} sm={6} md={4} key={column.id}>
          <Column
            column={column}
            updateColumn={updateColumn}
            deleteColumn={deleteColumn}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default ColumnGrid;
