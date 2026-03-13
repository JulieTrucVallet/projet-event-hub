import { useMemo, useState } from "react";
import type { IUserService } from "../services/user.service";
import type { RegisterFormData } from "../types/user.types";
import { validatePassword } from "../validators/password.validator";

type FieldErrors = Partial<Record<keyof RegisterFormData, string>>;

export function useRegisterPresenter(userService: IUserService) {
  const [form, setForm] = useState<RegisterFormData>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordCheck = useMemo(
    () => validatePassword(form.password),
    [form.password]
  );

  const fieldErrors: FieldErrors = useMemo(() => {
    const errors: FieldErrors = {};

    if (!form.firstname.trim()) errors.firstname = "Prénom obligatoire";
    if (!form.lastname.trim()) errors.lastname = "Nom obligatoire";
    if (!form.email.trim()) errors.email = "Email obligatoire";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Email invalide";

    if (!form.password) errors.password = "Mot de passe obligatoire";
    else if (!passwordCheck.isValid)
      errors.password = "Mot de passe non conforme";

    return errors;
  }, [form, passwordCheck.isValid]);

  const canSubmit =
    Object.keys(fieldErrors).length === 0 && !submitting && !success;

  function updateField<K extends keyof RegisterFormData>(
    key: K,
    value: RegisterFormData[K]
  ) {
    setSuccess(false);
    setServerError(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit() {
    setServerError(null);

    if (!canSubmit) return;

    setSubmitting(true);
    const res = await userService.register(form);
    setSubmitting(false);

    if (!res.ok) {
      setSuccess(false);
      setServerError(res.message);
      return;
    }

    setSuccess(true);
  }

  return {
    form,
    updateField,
    submit,
    submitting,
    serverError,
    success,
    canSubmit,
    fieldErrors,
    passwordCheck,
  };
}