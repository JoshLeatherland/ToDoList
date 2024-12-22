import { Box, Typography } from "@mui/material";

function EmptyState() {
  return (
    <Box sx={{ textAlign: "center", marginTop: 4, color: "text.secondary" }}>
      <Typography variant="h6" gutterBottom>
        Welcome to the To-Do App!
      </Typography>
      <Typography>
        Click the settings icon in the top right to get started by adding
        columns.
      </Typography>
    </Box>
  );
}

export default EmptyState;
