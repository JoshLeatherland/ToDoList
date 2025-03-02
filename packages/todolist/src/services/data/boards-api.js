import { useAxiosClient } from "../../hooks";

export default {
  get: async (apiUrl) => {
    const axiosClient = useAxiosClient();

    const response = await axiosClient.get(`${apiUrl}/boards`);
    return response;
  },
  put: async (apiUrl, board) => {
    const axiosClient = useAxiosClient();

    const response = await axiosClient.put(`${apiUrl}/boards`, board);
    return response;
  },
};
