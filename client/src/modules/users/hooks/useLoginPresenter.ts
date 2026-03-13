import { useMemo, useState } from "react";
import type { IUserService } from "../services/user.service";

type LoginOkData = {
  requires2fa: boolean;
  pendingToken?: string;
  accessToken?: string;
  user?: { email: string; id?: string };
};

export function useLoginPresenter(userService: IUserService) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<LoginOkData | null>(null);

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password) return false;
    if (!/^\S+@\S+\.\S+$/.test(email)) return false;
    return !submitting;
  }, [email, password, submitting]);

  async function submit() {
    setError(null);
    setData(null);
    if (!canSubmit) return;

    setSubmitting(true);
    const res = await userService.login({ email, password });
    setSubmitting(false);

    if (!res.ok) {
      setError(res.message);
      return;
    }

    setData(res.data as LoginOkData);
  }

  return {
    email,
    password,
    setEmail,
    setPassword,
    submit,
    canSubmit,
    submitting,
    error,

    requires2fa: data?.requires2fa ?? false,
    pendingToken: data?.pendingToken,
    accessToken: data?.accessToken,
    user: data?.user,
    isLoggedIn: Boolean(data && !data.requires2fa && data.accessToken),
    is2faPending: Boolean(data && data.requires2fa && data.pendingToken),
  };
}