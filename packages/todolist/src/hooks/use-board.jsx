import {
  useMutation,
  useQuery,
  useQueryClient,
  useIsFetching,
  useIsMutating,
} from "@tanstack/react-query";
import boardsApi from "../services/data/boards-api";
import { useNavigate } from "react-router-dom";
import { useAxiosClient } from "../hooks";

export const useBoard = ({ apiUrl = "", enabled = false }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const axiosClient = useAxiosClient(null);

  const { data: boardData, isError } = useQuery({
    queryKey: ["board", apiUrl],
    queryFn: async () => {
      const board = await boardsApi.get(axiosClient, apiUrl);
      return board.data;
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const { mutate: saveBoard } = useMutation({
    mutationKey: ["board", apiUrl],
    mutationFn: async (updatedBoard) => {
      return await boardsApi.put(axiosClient, apiUrl, updatedBoard);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", apiUrl] });
    },
  });

  const isFetching = useIsFetching({ queryKey: ["board", apiUrl] });
  const isSaving = useIsMutating({ mutationKey: ["board", apiUrl] });

  const updateColumns = (newColumns) => {
    if (!boardData) return;

    const updatedBoard = {
      ...boardData,
      columns: newColumns,
    };

    saveBoard(updatedBoard);
  };

  const updateColumn = (id, updatedColumn) => {
    if (!boardData) return;

    const newColumns = boardData.columns.map((column) =>
      column.id === id ? updatedColumn : column
    );

    updateColumns(newColumns);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (!boardData) return;

    const sourceColumn = boardData.columns.find(
      (col) => col.id === source.droppableId
    );
    const destColumn = boardData.columns.find(
      (col) => col.id === destination.droppableId
    );

    if (!sourceColumn || !destColumn) return;

    // Create copies of the tasks
    const sourceTasks = [...sourceColumn.tasks];
    const destTasks =
      sourceColumn.id === destColumn.id ? sourceTasks : [...destColumn.tasks];

    // Remove the moved task from the source column
    const [movedTask] = sourceTasks.splice(source.index, 1);

    // Insert the task into the destination column
    destTasks.splice(destination.index, 0, movedTask);

    updateColumns(
      boardData.columns.map((col) => {
        if (col.id === sourceColumn.id) return { ...col, tasks: sourceTasks };
        if (col.id === destColumn.id) return { ...col, tasks: destTasks };
        return col;
      })
    );
  };

  return {
    columns: boardData?.columns || [],
    updateColumns,
    updateColumn,
    loading: isFetching || isSaving,
    isError,
    onDragEnd,
  };
};
