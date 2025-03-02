import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "../Task";

function ScrollableTasks({
  tasks = [],
  droppableId,
  blur,
  onUpdateTask,
  onDeleteTask,
}) {
  const [enabled, setEnabled] = useState(false);

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
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <Box
          {...provided.droppableProps}
          ref={provided.innerRef}
          sx={{
            minHeight: "18rem",
            maxHeight: "18rem",
            overflowY: "auto",
            filter: blur ? "blur(5px)" : "none",
            transition: "filter 0.3s ease",
          }}
        >
          {tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <Task
                    task={task}
                    onUpdateTask={(updatedTask) =>
                      onUpdateTask(task.id, updatedTask)
                    }
                    onDeleteTask={() => onDeleteTask(task.id)}
                  />
                </Box>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
}

export default ScrollableTasks;

ScrollableTasks.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      comments: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
          timestamp: PropTypes.string.isRequired,
        })
      ),
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
  droppableId: PropTypes.string.isRequired,
  blur: PropTypes.bool,
  onUpdateTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
};
