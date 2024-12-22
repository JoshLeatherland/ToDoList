import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import Task from "../Task";
import ConfirmationDialog from "../ConfirmationDialog";

function Column({ column, updateColumn, deleteColumn }) {
  const [newTask, setNewTask] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const theme = useTheme();

  const addTask = () => {
    if (newTask.trim() === "") return;
    const updatedColumn = {
      ...column,
      tasks: [
        ...column.tasks,
        {
          id: Date.now(),
          text: newTask,
          completed: false,
          comments: [],
          timestamp: new Date().toLocaleString(),
        },
      ],
    };
    updateColumn(column.id, updatedColumn);
    setNewTask("");
  };

  const updateTask = (taskId, updatedTask) => {
    const updatedTasks = column.tasks.map((task) =>
      task.id === taskId ? updatedTask : task
    );
    updateColumn(column.id, { ...column, tasks: updatedTasks });
  };

  const deleteTask = (taskId) => {
    const updatedTasks = column.tasks.filter((task) => task.id !== taskId);
    updateColumn(column.id, { ...column, tasks: updatedTasks });
  };

  const confirmDeleteColumn = () => {
    deleteColumn(column.id);
    setShowDeleteDialog(false);
  };

  const completedTasks = column.tasks.filter((task) => task.completed);
  const incompleteTasks = column.tasks.filter((task) => !task.completed);

  return (
    <>
      <Card
        sx={{
          backgroundColor: theme.palette.backgrounds.column,
          boxShadow: 0,
          borderRadius: "8px",
        }}
      >
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
              {column.name} ({incompleteTasks.length})
            </Typography>
            <Button color="secondary" onClick={() => setShowDeleteDialog(true)}>
              Delete
            </Button>
          </Box>
          <Box display="flex" gap={1} mb={2}>
            <TextField
              variant="outlined"
              size="small"
              label="New Task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              sx={{ flexGrow: 1 }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTask();
                }
              }}
            />
            <Button variant="contained" size="small" onClick={addTask}>
              Add
            </Button>
          </Box>
          <Box>
            {incompleteTasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                onUpdateTask={(updatedTask) => updateTask(task.id, updatedTask)}
                onDeleteTask={() => deleteTask(task.id)}
              />
            ))}
          </Box>
          <Typography variant="subtitle2" mt={2}>
            Completed: {completedTasks.length}{" "}
            <Button
              size="small"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? "Hide" : "Show"}
            </Button>
          </Typography>
          {showCompleted &&
            completedTasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                onUpdateTask={(updatedTask) => updateTask(task.id, updatedTask)}
                onDeleteTask={() => deleteTask(task.id)}
              />
            ))}
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showDeleteDialog}
        title="Delete Column"
        description="Are you sure you want to delete this column? All tasks within this column will also be deleted."
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteColumn}
      />
    </>
  );
}

export default Column;

Column.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired,
        comments: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            text: PropTypes.string.isRequired,
            timestamp: PropTypes.string.isRequired,
          })
        ),
        timestamp: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  updateColumn: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func.isRequired,
};
