import {
  Alert,
  Box,
  Button,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterPresenter } from "../hooks/useRegisterPresenter";
import { UserService } from "../services/user.service";

const userService = new UserService();

export const RegisterForm: React.FC = () => {
  const presenter = useRegisterPresenter(userService);
  const navigate = useNavigate();

  useEffect(() => {
    if (presenter.success) {
      const t = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 600);
      return () => clearTimeout(t);
    }
  }, [presenter.success, navigate]);

  return (
    <Box sx={{ display: "grid", gap: 2, maxWidth: 520 }}>
      <Typography variant="h4">Créer un compte</Typography>

      {presenter.serverError && (
        <Alert severity="error">{presenter.serverError}</Alert>
      )}
      {presenter.success && (
        <Alert severity="success">Compte créé ✅ Redirection…</Alert>
      )}

      <TextField
        label="Prénom"
        value={presenter.form.firstname}
        onChange={(e) => presenter.updateField("firstname", e.target.value)}
        error={Boolean(presenter.fieldErrors.firstname)}
        helperText={presenter.fieldErrors.firstname ?? " "}
      />

      <TextField
        label="Nom"
        value={presenter.form.lastname}
        onChange={(e) => presenter.updateField("lastname", e.target.value)}
        error={Boolean(presenter.fieldErrors.lastname)}
        helperText={presenter.fieldErrors.lastname ?? " "}
      />

      <TextField
        label="Email"
        value={presenter.form.email}
        onChange={(e) => presenter.updateField("email", e.target.value)}
        error={Boolean(presenter.fieldErrors.email)}
        helperText={presenter.fieldErrors.email ?? " "}
      />

      <TextField
        label="Mot de passe"
        type="password"
        value={presenter.form.password}
        onChange={(e) => presenter.updateField("password", e.target.value)}
        error={Boolean(presenter.fieldErrors.password)}
        helperText={presenter.fieldErrors.password ?? " "}
      />

      {!presenter.passwordCheck.isValid && presenter.form.password.length > 0 && (
        <Box sx={{ border: "1px solid #ddd", borderRadius: 2, padding: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Votre mot de passe doit contenir :
          </Typography>
          <List dense sx={{ m: 0, p: 0 }}>
            {presenter.passwordCheck.errors.map((e) => (
              <ListItem key={e} sx={{ py: 0, px: 0 }}>
                • {e}
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Button
        variant="contained"
        disabled={!presenter.canSubmit}
        onClick={presenter.submit}
      >
        {presenter.submitting ? "Création..." : "Créer mon compte"}
      </Button>

      <Button
        variant="text"
        onClick={() => navigate("/login")}
        sx={{ alignSelf: "flex-start" }}
      >
        Déjà un compte ? Se connecter
      </Button>
    </Box>
  );
};