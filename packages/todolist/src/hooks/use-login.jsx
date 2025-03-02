import { useMutation, useIsMutating } from "@tanstack/react-query";
import { useAxiosClient } from "./use-axios-client";
import { useEnv } from "../contexts";

export const useLogin = () => {
  const axiosClient = useAxiosClient();
  const { apiUrl } = useEnv();

  const isMutatingLogin = useIsMutating({ mutationKey: ["token"] });

  const {
    mutate: login,
    data: loginResponse,
    error,
  } = useMutation({
    mutationKey: ["token"],
    mutationFn: async ({ authorizationCode }) => {
      try {
        const response = await axiosClient.post(
          `${apiUrl}/token?authorizationCode=${authorizationCode}`
        );
        return response;
      } catch (error) {
        return null;
      }
    },
    onError: () => {
      return null;
    },
  });

  return {
    login,
    loginLoading: Boolean(isMutatingLogin),
    loginResult: loginResponse?.data,
    loginError: error?.message,
  };
};
