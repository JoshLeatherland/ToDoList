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

  const handleUnauthorized = () => {
    navigate("/auth");
  };

  const axiosClient = useAxiosClient(null, handleUnauthorized);

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
    mutationFn: async (updatedBoard) => {
      return await boardsApi.put(axiosClient, apiUrl, updatedBoard);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", apiUrl] });
    },
  });

  const isFetching = useIsFetching({ queryKey: ["board", apiUrl] }) > 0;
  const isSaving = useIsMutating({ mutationKey: ["board", apiUrl] }) > 0;

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

  return {
    columns: boardData?.columns || [],
    updateColumns,
    updateColumn,
    loading: isFetching || isSaving,
    isError,
  };
};
