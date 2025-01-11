import PropTypes from "prop-types";
import { Box, IconButton, Typography, Paper, Container } from "@mui/material";
import { useTheme } from "@emotion/react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

function SortableColumns({
  columns,
  setSelectedColumn,
  setShowDeleteDialog,
  setSelectedColumnEdit,
}) {
  const [enabled, setEnabled] = useState(false);
  const theme = useTheme();
  const { t } = useTranslation();

  // This useEffect is used to prevent the DroppableContainer from rendering. This is due to a StrictMode bug in react 18
  // https://github.com/atlassian/react-beautiful-dnd/issues/2399
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Droppable droppableId="columns">
      {(provided) => (
        <Container
          {...provided.droppableProps}
          ref={provided.innerRef}
          disableGutters
          sx={{ mt: 2 }}
        >
          {columns.length > 0 ? (
            columns.map((column, index) => (
              <Draggable
                key={String(column.id)}
                draggableId={String(column.id)}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 16px",
                        marginBottom: "8px",
                        borderRadius: "8px",
                        boxShadow: 0,
                        backgroundColor: theme.palette.tasks?.active,
                      }}
                    >
                      <Box flexGrow={1} ml={2}>
                        <Typography
                          variant="body1"
                          sx={{
                            textDecoration: "none",
                            color: theme.palette.tasks?.text?.active,
                          }}
                        >
                          {column.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {t("column.taskCount", {
                            tasks: column.tasks.length,
                          })}
                        </Typography>
                      </Box>

                      <Box>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => {
                            setSelectedColumnEdit(column);
                            console.log(column);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          size="small"
                          onClick={() => {
                            setSelectedColumn(column);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Paper>
                  </div>
                )}
              </Draggable>
            ))
          ) : (
            <Box
              sx={{
                backgroundColor: theme.palette.tasks?.active,
                width: "100%",
                padding: "1em",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "1em",
              }}
            >
              <Typography sx={{ textAlign: "center" }}>
                {t("column.noColumns")}
              </Typography>
            </Box>
          )}
          {provided.placeholder}
        </Container>
      )}
    </Droppable>
  );
}

export default SortableColumns;

SortableColumns.propTypes = {
  columns: PropTypes.array,
  setSelectedColumn: PropTypes.func,
  setShowDeleteDialog: PropTypes.func,
  setSelectedColumnEdit: PropTypes.func,
};
