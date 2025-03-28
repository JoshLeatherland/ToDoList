import { Container, Box, Button, Typography, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { Loader } from "../../components";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin, useAuth } from "../../hooks";
import { useEnv } from "../../contexts";
import { useTranslation, Trans } from "react-i18next";

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

  const { t, ready } = useTranslation();

  if (!ready) return <div>{t("shared.loading")}</div>;

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
            {t("auth.loading")}
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
            {t("auth.title")}
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            mb={3}
          >
            {t("auth.description")}
          </Typography>

          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            mb={4}
          >
            <Trans
              i18nKey="auth.redirectMsg"
              components={{ strong: <strong /> }}
              values={{ domain: "auth.joshleatherland.co.uk" }}
            />
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, borderRadius: 2 }}
            onClick={() => handleLogin()}
          >
            {t("auth.continue")}
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
