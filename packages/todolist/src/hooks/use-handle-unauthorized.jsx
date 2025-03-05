import { useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEnv } from "../contexts";

export const useHandleUnauthorized = () => {
  const navigate = useNavigate();
  const { apiUrl } = useEnv();

  return useCallback(
    async (error) => {
      try {
        const refreshResponse = await axios.post(
          `${apiUrl}/refresh`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.status === 200) {
          // this will retry the original request with the new token
          return axios(error.config);
        }
      } catch (refreshError) {
        navigate("/auth");
        return Promise.reject(refreshError);
      }
    },
    [navigate]
  );
};
