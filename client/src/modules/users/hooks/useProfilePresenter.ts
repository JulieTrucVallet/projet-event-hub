import { useMemo, useState } from "react";
import type { IUserService } from "../services/user.service";
import type { Profile } from "../types/profile.types";

export function useProfilePresenter(userService: IUserService, initialProfile: Profile) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isValid = useMemo(() => {
    if (!profile.firstname.trim()) return false;
    if (!profile.lastname.trim()) return false;
    if (!profile.email.trim()) return false;
    if (!/^\S+@\S+\.\S+$/.test(profile.email)) return false;
    return true;
  }, [profile]);

  const canSubmit = isValid && !submitting;

  function updateField<K extends keyof Profile>(key: K, value: Profile[K]) {
    setSuccess(false);
    setError(null);
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  async function submit() {
    setError(null);
    setSuccess(false);
    if (!canSubmit) return;

    setSubmitting(true);
    const res = await userService.updateProfile(profile);
    setSubmitting(false);

    if (!res.ok) {
      setError(res.message);
      return;
    }

    setProfile(res.data);
    setSuccess(true);
  }

  return {
    profile,
    updateField,
    submit,
    canSubmit,
    submitting,
    error,
    success,
  };
}