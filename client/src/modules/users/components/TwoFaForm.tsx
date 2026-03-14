import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserService } from "../services/user.service";

const userService = new UserService();

export const TwoFaForm: React.FC = () => {
  const navigate = useNavigate();

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [pendingToken] = useState<string | null>(() => localStorage.getItem("pendingToken"));
  const code = useMemo(() => digits.join(""), [digits]);

  const [openBackup, setOpenBackup] = useState(false);
  const [backupCode, setBackupCode] = useState("");
  const [backupSubmitting, setBackupSubmitting] = useState(false);

  useEffect(() => {
    if (!pendingToken) {
      navigate("/login", { replace: true });
    }
  }, [pendingToken, navigate]);

  const setDigitAt = (index: number, value: string) => {
    const v = value.replace(/\D/g, "").slice(0, 1);

    setDigits((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });

    if (v && index < 5) {
      const el = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      el?.focus();
    }
  };

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const el = document.getElementById(`otp-${index - 1}`) as HTMLInputElement | null;
      el?.focus();
    }
  };

  const logout = () => {
    localStorage.removeItem("pendingToken");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const goToProfile = async () => {
    const me = await userService.getMe();
    if (!me.ok) {
      setError(me.message);
      return;
    }

    localStorage.removeItem("pendingToken");
    navigate("/me", { replace: true });
  };

  const submit = async () => {
    try {
      setError(null);

      if (!pendingToken) {
        setError("Session 2FA manquante. Reconnectez-vous.");
        navigate("/login", { replace: true });
        return;
      }

      if (code.length !== 6) {
        setError("Le code doit contenir 6 chiffres.");
        return;
      }

      setSubmitting(true);

      const result = await userService.verify2fa({
        pendingToken,
        token: code,
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      await goToProfile();
    } catch (e: any) {
      setError(e?.message ?? "Erreur lors de la vérification 2FA.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackupSubmit = async () => {
    try {
      setError(null);

      if (!pendingToken) {
        setError("Session 2FA manquante. Reconnectez-vous.");
        navigate("/login", { replace: true });
        return;
      }

      if (!backupCode.trim()) {
        setError("Veuillez saisir un code de secours.");
        return;
      }

      setBackupSubmitting(true);

      const result = await userService.backup2fa({
        pendingToken,
        code: backupCode.trim(),
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setOpenBackup(false);
      setBackupCode("");

      await goToProfile();
    } catch (e: any) {
      setError(e?.message ?? "Erreur lors de la connexion via code de secours.");
    } finally {
      setBackupSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: "grid", placeItems: "center", minHeight: "70vh", px: 2 }}>
      <Box sx={{ width: "100%", maxWidth: 520, display: "grid", gap: 2 }}>
        <Typography variant="h5" align="center">
          Double Authentification
        </Typography>

        <Typography variant="body2" align="center" color="text.secondary">
          Confirmez le code
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          {digits.map((d, i) => (
            <Box
              key={i}
              component="input"
              id={`otp-${i}`}
              value={d}
              onChange={(e: any) => setDigitAt(i, e.target.value)}
              onKeyDown={(e: any) => onKeyDown(i, e)}
              inputMode="numeric"
              style={{
                width: 44,
                height: 44,
                textAlign: "center",
                fontSize: 18,
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <Button variant="contained" onClick={submit} disabled={submitting}>
            {submitting ? "Validation..." : "Valider"}
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              setDigits(["", "", "", "", "", ""]);
              setError(null);
              const el = document.getElementById("otp-0") as HTMLInputElement | null;
              el?.focus();
            }}
          >
            Annuler
          </Button>
        </Box>

        <Box sx={{ borderTop: "1px solid #eee", pt: 2 }}>
          <Typography variant="body2" align="center" color="text.secondary">
            Vous ne pouvez plus accéder à votre application d&apos;authentification ?{" "}
            <Link
              component="button"
              onClick={() => {
                setError(null);
                setBackupCode("");
                setOpenBackup(true);
              }}
              underline="hover"
            >
              Utiliser un code de secours
            </Link>
          </Typography>
        </Box>

        <Box sx={{ borderTop: "1px solid #eee", pt: 2 }}>
          <Typography variant="body2" align="center" color="text.secondary">
            Vous souhaitez vous authentifier avec un autre compte ? Commencez par vous déconnecter.{" "}
            <Link component="button" onClick={logout} underline="hover">
              Me déconnecter
            </Link>
          </Typography>
        </Box>
      </Box>

      <Dialog open={openBackup} onClose={() => setOpenBackup(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Code de secours</DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Si vous ne pouvez pas accéder à votre application d&apos;authentification, saisissez un
            code de secours à usage unique.
          </Typography>

          <TextField
            label="Code de secours"
            placeholder="ex: 1fd4d-0123-86a2-6251"
            value={backupCode}
            onChange={(e) => setBackupCode(e.target.value)}
            autoFocus
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setOpenBackup(false);
              setBackupCode("");
            }}
          >
            Annuler
          </Button>

          <Button variant="contained" onClick={handleBackupSubmit} disabled={backupSubmitting}>
            {backupSubmitting ? "Connexion..." : "Soumettre un code de secours"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};