export default {
  get: async (axiosClient, apiUrl) => {
    const response = await axiosClient.get(`${apiUrl}/boards`);
    return response;
  },
  put: async (axiosClient, apiUrl, board) => {
    const response = await axiosClient.put(`${apiUrl}/boards`, board, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  },
};
