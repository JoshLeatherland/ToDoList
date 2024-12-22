import { Box, Typography } from "@mui/material";

function EmptyState() {
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
        Welcome to the To-Do App!
      </Typography>
      <Typography>
        Click the <strong>settings icon</strong> in the top right to get started
        by adding columns.
      </Typography>

      <Typography sx={{ marginY: 2 }}>OR</Typography>

      <Typography>
        Explore the{" "}
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
          GitHub repository.
        </a>
      </Typography>
    </Box>
  );
}

export default EmptyState;
