import { createContext, useContext } from "react";

const EnvContext = createContext(null);

export const EnvProvider = ({ children }) => {
  const envValues = {
    apiUrl: import.meta.env.VITE_API_URL || "",
    loginUrl: import.meta.env.VITE_LOGIN_URL || "",
  };
  return (
    <EnvContext.Provider value={envValues}>{children}</EnvContext.Provider>
  );
};

export const useEnv = () => {
  const context = useContext(EnvContext);
  if (!context) {
    return;
  }
  return context;
};
