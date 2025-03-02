import { useState, useEffect } from "react";

export const useBoard = (dataApiUrl = "", isLocal = true) => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBoard();
      setColumns(data);
    };
    fetchData();
  }, []);

  const getBoard = async () => {
    if (isLocal) {
      return getLocal();
    }
    return [];
  };

  const saveBoard = async (data) => {
    if (isLocal) {
      saveLocal(data);
    }
  };

  const updateColumns = (newColumns) => {
    setColumns(newColumns);
    saveBoard(newColumns);
  };

  const updateColumn = (id, updatedColumn) => {
    setColumns((prevColumns) => {
      const newColumns = prevColumns.map((column) =>
        column.id === id ? updatedColumn : column
      );
      saveBoard(newColumns);
      return newColumns;
    });
  };

  const getLocal = () => {
    const savedColumns = localStorage.getItem("columns");
    return savedColumns ? JSON.parse(savedColumns) : [];
  };

  const saveLocal = (data) => {
    localStorage.setItem("columns", JSON.stringify(data));
  };

  return {
    columns,
    updateColumns,
    updateColumn,
  };
};
