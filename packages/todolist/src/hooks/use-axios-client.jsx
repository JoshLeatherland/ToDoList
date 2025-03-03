import axios from "axios";

export const useAxiosClient = (onForbidden = null, onUnauthorized = null) => {
  const axiosClient = axios.create({
    baseURL: null,
    withCredentials: true,
  });

  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        if (error.response.status === 403 && onForbidden) {
          onForbidden();
        } else if (error.response.status === 401 && onUnauthorized) {
          onUnauthorized();
        }
        return Promise.reject(error);
      }
    }
  );

  return axiosClient;
};
