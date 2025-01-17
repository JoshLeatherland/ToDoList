import { Children, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Checkbox,
  IconButton,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmationDialog from "../ConfirmationDialog";
import { useTranslation } from "react-i18next";

function Task({ task, onUpdateTask, onDeleteTask }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [taskName, setTaskName] = useState(task.text);
  const [taskDescription, setTaskDescription] = useState(
    task.description || ""
  );
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([...task.comments]);

  const theme = useTheme();

  const toggleComplete = () => {
    onUpdateTask({
      ...task,
      completed: !task.completed,
      completedDate: !task.completed ? new Date().toLocaleString() : null,
    });
  };

  const confirmDelete = () => {
    onDeleteTask(task.id);
    setShowDeleteDialog(false);
  };

  const saveTaskChanges = (closeDialog = true) => {
    const updatedTask = {
      ...task,
      text: taskName,
      description: taskDescription,
      comments,
    };
    onUpdateTask(updatedTask);

    if (closeDialog) {
      setShowEditDialog(false);
    }
  };

  const addComment = () => {
    if (newComment.trim() === "") return;

    const newCommentObj = {
      id: Date.now(),
      text: newComment,
      timestamp: new Date().toLocaleString(),
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
    saveTaskChanges(false);
  };

  const { t, ready } = useTranslation();

  if (!ready) return <div>{t("shared.loading")}</div>;

  return (
    <>
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
          backgroundColor: task.completed
            ? theme.palette.tasks?.completed
            : theme.palette.tasks?.active,
        }}
      >
        <Checkbox
          checked={task.completed}
          onChange={toggleComplete}
          sx={{
            color: theme.palette.primary.main,
            "&.Mui-checked": { color: theme.palette.primary.main },
          }}
        />

        <Box flexGrow={1} ml={2}>
          <Typography
            variant="body1"
            sx={{
              textDecoration: task.completed ? "line-through" : "none",
              color: task.completed
                ? theme.palette.tasks?.text?.completed
                : theme.palette.tasks?.text?.active,
            }}
          >
            {task.text}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {task.timestamp} {"  "}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            - {task.comments.length} {t("task.comments.camel")}
          </Typography>
        </Box>

        <Box>
          <IconButton
            color="primary"
            size="small"
            onClick={() => setShowEditDialog(true)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            size="small"
            onClick={() => setShowDeleteDialog(true)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Paper>

      <ConfirmationDialog
        open={showDeleteDialog}
        title={t("task.deleteTitle")}
        description={t("task.deleteDescription")}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
      />

      <Dialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t("task.editTitle")}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            label={t("task.name")}
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                saveTaskChanges();
              }
            }}
            margin="normal"
          />
          {/* may eventually make this a WYSIWYG */}
          <TextField
            fullWidth
            variant="outlined"
            label={t("task.description")}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                saveTaskChanges();
              }
            }}
            margin="normal"
            multiline={true}
            minRows={5}
          />

          <Typography variant="subtitle2" mt={2} mb={1}>
            {t("task.comments.pascal")}
          </Typography>
          <Box display="flex" gap={1} mb={2}>
            <TextField
              fullWidth
              variant="standard"
              label={t("task.addComment")}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addComment();
                }
              }}
            />
            <Button variant="text" onClick={addComment}>
              {t("shared.add")}
            </Button>
          </Box>
          <List>
            {comments.map((comment) => (
              <ListItem key={comment.id} disablePadding>
                <ListItemText
                  primary={comment.text}
                  secondary={comment.timestamp}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)} color="secondary">
            {t("shared.cancel")}
          </Button>
          <Button onClick={saveTaskChanges} color="primary" variant="contained">
            {t("shared.save")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Task;

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    timestamp: PropTypes.string,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onUpdateTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
};
