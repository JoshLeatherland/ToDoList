import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Snackbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Loader } from "../../components";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin, useAuth } from "../../hooks";
import { useEnv } from "../../contexts";

function Auth() {
  const [validationError, setValidationError] = useState("");

  const navigate = useNavigate();
  const { loginUrl } = useEnv();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");

  const { login, loginLoading, loginResult } = useLogin();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    if (code) {
      login({
        authorizationCode: code,
      });
    }
  }, [code]);

  useEffect(() => {
    if (loginResult && loginResult === true) {
      setIsAuthenticated(true);
      navigate("/");
    } else {
      navigate("/auth");
    }
  }, [loginResult]);

  const handleLogin = () => {
    setValidationError("");

    window.location = loginUrl;
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 100px)",
        padding: 2,
      }}
    >
      <Loader open={loginLoading} />

      {code && (
        <Box
          sx={{
            width: "100%",
            bgcolor: "background.main",
            p: 3,
            borderRadius: 2,
            boxShadow: 0,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="fontWeightBold"
            align="center"
            mb={2}
            color="text.primary"
          >
            Loading, please wait.
          </Typography>
        </Box>
      )}

      {!code && !loginLoading && (
        <Box
          sx={{
            width: "100%",
            bgcolor: "background.main",
            p: 4,
            borderRadius: 3,
            boxShadow: 1,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="fontWeightBold"
            align="center"
            mb={3}
            color="text.primary"
          >
            Secure Login
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            mb={3}
          >
            To access your account, we use a secure single sign-on platform that
            ensures a seamless and safe login experience.
          </Typography>

          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            mb={4}
          >
            You will be securely redirected to{" "}
            <strong>auth.joshleatherland.co.uk</strong> to complete your login
            process.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, borderRadius: 2 }}
            onClick={() => handleLogin()}
          >
            Continue to Login
          </Button>
        </Box>
      )}

      <Snackbar
        open={Boolean(validationError.length)}
        autoHideDuration={2000}
        onClose={() => setValidationError("")}
        message={validationError.length ? validationError : ""}
      />
    </Container>
  );
}

export default Auth;
