import axios from "axios";
import { useHandleUnauthorized } from "../hooks";

export const useAxiosClient = (onForbidden = null) => {
  const handleUnauthorized = useHandleUnauthorized();

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
        } else if (error.response.status === 401) {
          return handleUnauthorized(error);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosClient;
};
