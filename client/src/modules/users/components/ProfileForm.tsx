import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfilePresenter } from "../hooks/useProfilePresenter";
import { UserService } from "../services/user.service";

const userService = new UserService();

export const ProfileForm: React.FC = () => {
  const navigate = useNavigate();

  const [open2fa, setOpen2fa] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [twoFaError, setTwoFaError] = useState<string | null>(null);
  const [loading2fa, setLoading2fa] = useState(false);

  const [activating2fa, setActivating2fa] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [openBackupModal, setOpenBackupModal] = useState(false);

  const [openDisableModal, setOpenDisableModal] = useState(false);
  const [disabling2fa, setDisabling2fa] = useState(false);
  const [disableError, setDisableError] = useState<string | null>(null);

  const stored = localStorage.getItem("user");
  const initialProfile = stored
    ? JSON.parse(stored)
    : { firstname: "", lastname: "", email: "", otpEnabled: false };

  if (!stored) {
    navigate("/login", { replace: true });
    return null;
  }

  const presenter = useProfilePresenter(userService, initialProfile);

  const is2faEnabled = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return false;
      const u = JSON.parse(raw);
      return !!u?.otpEnabled;
    } catch {
      return false;
    }
  }, [openBackupModal, openDisableModal, presenter.success]);

  const getUserId = (): string | null => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const u = JSON.parse(raw);
      return u?.id ?? null;
    } catch {
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("pendingToken");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const open2faModal = async () => {
    try {
      setTwoFaError(null);
      setQr(null);
      setOtp("");

      setLoading2fa(true);
      setOpen2fa(true);

      const userId = getUserId();
      if (!userId) {
        setTwoFaError("Impossible de trouver l'id utilisateur (userId).");
        return;
      }

      const result = await userService.init2fa({ userId });

      if (!result.ok) {
        setTwoFaError(result.message);
        return;
      }

      if (!result.data.qrCodeDataUrl) {
        setTwoFaError("Réponse inattendue du serveur (QR manquant).");
        return;
      }

      setQr(result.data.qrCodeDataUrl);
    } catch (e: any) {
      setTwoFaError(e?.message ?? "Erreur lors de l'initialisation 2FA.");
    } finally {
      setLoading2fa(false);
    }
  };

  const handleConfirm2fa = async () => {
    try {
      setTwoFaError(null);

      const userId = getUserId();
      if (!userId) {
        setTwoFaError("Impossible de trouver l'id utilisateur (userId).");
        return;
      }

      if (otp.length !== 6) {
        setTwoFaError("Le code doit contenir 6 chiffres.");
        return;
      }

      setActivating2fa(true);

      const result = await userService.confirm2fa({ userId, token: otp });
      if (!result.ok) {
        setTwoFaError(result.message);
        return;
      }

      setBackupCodes(result.data.backupCodes ?? []);

      const me = await userService.getMe();
      if (!me.ok) {
        setTwoFaError(me.message);
        return;
      }

      setOpen2fa(false);
      setOpenBackupModal(true);
    } catch (e: any) {
      setTwoFaError(e?.message ?? "Erreur lors de l'activation 2FA.");
    } finally {
      setActivating2fa(false);
    }
  };

  const downloadBackupCodesTxt = () => {
    const content = backupCodes.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "codes_de_secours.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleDisable2fa = async () => {
    try {
      setDisableError(null);

      const userId = getUserId();
      if (!userId) {
        setDisableError("Impossible de trouver l'id utilisateur (userId).");
        return;
      }

      setDisabling2fa(true);

      const result = await userService.disable2fa({ userId });
      if (!result.ok) {
        setDisableError(result.message);
        return;
      }

      const me = await userService.getMe();
      if (!me.ok) {
        setDisableError(me.message);
        return;
      }

      setOpenDisableModal(false);
    } catch (e: any) {
      setDisableError(e?.message ?? "Erreur lors de la désactivation 2FA.");
    } finally {
      setDisabling2fa(false);
    }
  };

  return (
    <Box sx={{ display: "grid", gap: 2, maxWidth: 520 }}>
      <Typography variant="h4">Mon profil</Typography>

      {presenter.error && <Alert severity="error">{presenter.error}</Alert>}
      {presenter.success && <Alert severity="success">Profil mis à jour ✅</Alert>}

      <TextField
        label="Prénom"
        value={presenter.profile.firstname}
        onChange={(e) => presenter.updateField("firstname", e.target.value)}
      />

      <TextField
        label="Nom"
        value={presenter.profile.lastname}
        onChange={(e) => presenter.updateField("lastname", e.target.value)}
      />

      <TextField
        label="Email"
        value={presenter.profile.email}
        onChange={(e) => presenter.updateField("email", e.target.value)}
      />

      <Button variant="contained" disabled={!presenter.canSubmit} onClick={presenter.submit}>
        {presenter.submitting ? "Enregistrement..." : "Enregistrer"}
      </Button>

      {!is2faEnabled ? (
        <Button variant="outlined" onClick={open2faModal}>
          Activer la double authentification
        </Button>
      ) : (
        <Button
          variant="contained"
          color="inherit"
          onClick={() => {
            setDisableError(null);
            setOpenDisableModal(true);
          }}
        >
          Désactiver la double authentification
        </Button>
      )}

      <Button variant="text" color="error" onClick={handleLogout}>
        Se déconnecter
      </Button>

      <Dialog open={open2fa} onClose={() => setOpen2fa(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Configurez votre double authentification</DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <Typography variant="body2">
            Scannez le QR code dans Google Authenticator / Authy, puis saisissez le code à 6 chiffres.
          </Typography>

          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: 2,
              height: 220,
              display: "grid",
              placeItems: "center",
              overflow: "hidden",
              p: 1,
            }}
          >
            {loading2fa ? (
              <Typography variant="body2">Chargement du QR code…</Typography>
            ) : twoFaError ? (
              <Alert severity="error" sx={{ width: "100%" }}>
                {twoFaError}
              </Alert>
            ) : qr ? (
              <Box component="img" src={qr} alt="QR Code 2FA" sx={{ maxWidth: "100%", maxHeight: "100%" }} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Aucun QR code pour l’instant
              </Typography>
            )}
          </Box>

          <TextField
            label="Code (6 chiffres)"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="123456"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen2fa(false)}>Fermer</Button>
          <Button variant="contained" onClick={handleConfirm2fa} disabled={activating2fa}>
            {activating2fa ? "Activation..." : "Activer"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openBackupModal} onClose={() => setOpenBackupModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Codes de secours</DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <Typography variant="body2">
            Voici vos codes de secours. Conservez-les dans un endroit sûr. Vous ne pourrez les voir qu’une seule fois.
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            {backupCodes.map((c) => (
              <Box
                key={c}
                sx={{
                  border: "1px solid #eee",
                  borderRadius: 1,
                  px: 1.5,
                  py: 1,
                  fontFamily: "monospace",
                  fontSize: 13,
                }}
              >
                {c}
              </Box>
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button variant="contained" onClick={downloadBackupCodesTxt}>
            Télécharger en .txt
          </Button>
          <Button variant="text" onClick={() => setOpenBackupModal(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDisableModal} onClose={() => setOpenDisableModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Désactiver la double authentification</DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <Typography variant="body2">
            Vous êtes sur le point de désactiver la double authentification (2FA) de votre compte.
          </Typography>
          <Typography variant="body2">
            Cela réduit considérablement la sécurité de votre compte. Sans 2FA, votre compte sera uniquement protégé par
            votre mot de passe, ce qui augmente les risques en cas de fuite ou de vol.
          </Typography>
          <Typography variant="body2">Êtes-vous sûr de vouloir continuer ?</Typography>

          {disableError && <Alert severity="error">{disableError}</Alert>}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button variant="contained" onClick={handleDisable2fa} disabled={disabling2fa}>
            {disabling2fa ? "Désactivation..." : "oui"}
          </Button>
          <Button variant="outlined" onClick={() => setOpenDisableModal(false)} disabled={disabling2fa}>
            non
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};