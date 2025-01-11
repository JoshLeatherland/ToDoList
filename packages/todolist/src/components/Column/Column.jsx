import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import Task from "../Task";
import { useTranslation } from "react-i18next";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

function Column({ column, updateColumn }) {
  const [newTask, setNewTask] = useState("");

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

  const toggleBlurTasks = () => {
    updateColumn(column.id, {
      ...column,
      blurTasks: !column.blurTasks,
    });
  };

  const completedTasks = column.tasks.filter((task) => task.completed);
  const incompleteTasks = column.tasks.filter((task) => !task.completed);

  const { t, ready } = useTranslation();

  if (!ready) return <div>{t("shared.loading")}</div>;

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

            <IconButton onClick={() => toggleBlurTasks()}>
              {column.blurTasks ? (
                <VisibilityIcon titleAccess={t("task.show")} />
              ) : (
                <VisibilityOffIcon titleAccess={t("task.blur")} />
              )}
            </IconButton>
          </Box>
          <Box display="flex" gap={1} mb={2}>
            <TextField
              variant="outlined"
              size="small"
              label={t("column.newTask")}
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
              {t("shared.add")}
            </Button>
          </Box>
          <Box
            sx={{
              filter: column.blurTasks ? "blur(5px)" : "none",
              transition: "filter 0.3s ease",
            }}
          >
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
            {t("column.completed")}: {completedTasks.length}{" "}
            <Button
              size="small"
              onClick={() => {
                updateColumn(column.id, {
                  ...column,
                  showCompleted: !column.showCompleted,
                });
              }}
            >
              {column.showCompleted ? t("column.hide") : t("column.show")}
            </Button>
          </Typography>
          <Box
            sx={{
              filter: column.blurTasks ? "blur(5px)" : "none",
              transition: "filter 0.3s ease",
            }}
          >
            {column.showCompleted &&
              completedTasks.map((task) => (
                <Task
                  key={task.id}
                  task={task}
                  onUpdateTask={(updatedTask) =>
                    updateTask(task.id, updatedTask)
                  }
                  onDeleteTask={() => deleteTask(task.id)}
                />
              ))}
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default Column;

Column.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    blurTasks: PropTypes.bool,
    showCompleted: PropTypes.bool,
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
};
