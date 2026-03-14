import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginPresenter } from "../hooks/useLoginPresenter";
import { UserService } from "../services/user.service";

const userService = new UserService();

export const LoginForm: React.FC = () => {
  const presenter = useLoginPresenter(userService);
  const navigate = useNavigate();

  useEffect(() => {
    if (presenter.is2faPending && presenter.pendingToken) {
      localStorage.setItem("pendingToken", presenter.pendingToken);
      navigate("/2fa", { replace: true });
      return;
    }

    if (presenter.isLoggedIn) {
      if (presenter.user) {
        localStorage.setItem("user", JSON.stringify(presenter.user));
      }

      navigate("/me", { replace: true });
    }
  }, [
    presenter.is2faPending,
    presenter.pendingToken,
    presenter.isLoggedIn,
    presenter.user,
    navigate,
  ]);

  return (
    <Box sx={{ display: "grid", gap: 2, maxWidth: 520 }}>
      <Typography variant="h4">Connexion</Typography>

      {presenter.error && <Alert severity="error">{presenter.error}</Alert>}

      <TextField
        label="Email"
        value={presenter.email}
        onChange={(e) => presenter.setEmail(e.target.value)}
      />

      <TextField
        label="Mot de passe"
        type="password"
        value={presenter.password}
        onChange={(e) => presenter.setPassword(e.target.value)}
      />

      <Button
        variant="contained"
        disabled={!presenter.canSubmit}
        onClick={presenter.submit}
      >
        {presenter.submitting ? "Connexion..." : "Se connecter"}
      </Button>

      <Button
        variant="text"
        onClick={() => navigate("/register")}
        sx={{ alignSelf: "flex-start" }}
      >
        Pas encore de compte ? Créer un compte
      </Button>
    </Box>
  );
};