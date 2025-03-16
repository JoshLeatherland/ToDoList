import { createContext, useEffect, useState } from "react";
import { useEnv } from "./env-context";
import { useNavigate } from "react-router-dom";
import { useAxiosClient } from "../hooks";
import { Loader } from "../components";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { apiUrl } = useEnv();

  const axiosClient = useAxiosClient();

  const verifyAuth = async () => {
    if (!apiUrl) return;

    try {
      setLoading(true);
      const response = await axiosClient.post(`${apiUrl}/verify`);

      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post(`${apiUrl}/signout`);
      setIsAuthenticated(false);
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  // useEffect(() => {
  //   verifyAuth();
  // }, [apiUrl]);

  if (loading) {
    return <Loader open={loading} />;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        logout,
        verifyAuth,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
