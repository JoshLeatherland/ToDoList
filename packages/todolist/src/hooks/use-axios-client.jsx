import axios from "axios";

export const useAxiosClient = (onForbidden = null) => {
  const axiosClient = axios.create({
    baseURL: null,
    withCredentials: true,
  });

  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 403 && onForbidden) {
        onForbidden();
      }
      return Promise.reject(error);
    }
  );

  return axiosClient;
};
