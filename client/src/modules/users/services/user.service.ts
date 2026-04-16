export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

type LoginApiData =
  | { requires2fa: true; pendingToken: string; user: { email: string } }
  | {
      requires2fa: false;
      user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        otpEnabled?: boolean;
      };
    };

export type RegisterPayload = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export type RegisterApiData = {
  id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
};

export type MeApiData = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  otpEnabled: boolean;
};

export type Init2faApiData = {
  secret: string;
  qrCodeDataUrl: string;
};

export type Confirm2faApiData = {
  backupCodes: string[];
};

export type Verify2faApiData = {
  ok: true;
};

export type Backup2faApiData = {
  ok: true;
};

export type Disable2faApiData = {
  ok?: true;
};

export interface IUserService {
  register(payload: RegisterPayload): Promise<ApiResult<RegisterApiData>>;
  login(payload: { email: string; password: string }): Promise<ApiResult<LoginApiData>>;
  updateProfile(payload: { firstname?: string; lastname?: string; email?: string }): Promise<ApiResult<MeApiData>>;
  init2fa(payload: { userId: string }): Promise<ApiResult<Init2faApiData>>;
  confirm2fa(payload: { userId: string; token: string }): Promise<ApiResult<Confirm2faApiData>>;
  verify2fa(payload: { pendingToken: string; token: string }): Promise<ApiResult<Verify2faApiData>>;
  backup2fa(payload: { pendingToken: string; code: string }): Promise<ApiResult<Backup2faApiData>>;
  disable2fa(payload: { userId: string }): Promise<ApiResult<Disable2faApiData>>;
  getMe(): Promise<ApiResult<MeApiData>>;
}

export class UserService implements IUserService {
  private baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8001/api/v1";

  async login(payload: { email: string; password: string }): Promise<ApiResult<LoginApiData>> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || json?.success === false) {
        return { ok: false, message: json?.error?.message ?? "Login failed" };
      }

      return { ok: true, data: json.data as LoginApiData };
    } catch {
      return { ok: false, message: "Impossible de contacter l'API" };
    }
  }

  async register(payload: RegisterPayload): Promise<ApiResult<RegisterApiData>> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || json?.success === false) {
        return { ok: false, message: json?.error?.message ?? "Register failed" };
      }

      return { ok: true, data: json.data as RegisterApiData };
    } catch {
      return { ok: false, message: "Impossible de contacter l'API" };
    }
  }

  async updateProfile(payload: { firstname?: string; lastname?: string; email?: string }): Promise<ApiResult<MeApiData>> {
    try {
      const res = await fetch(`${this.baseUrl}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || json?.success === false) {
        return { ok: false, message: json?.error?.message ?? "Update failed" };
      }

      localStorage.setItem("user", JSON.stringify(json.data));
      return { ok: true, data: json.data as MeApiData };
    } catch {
      return { ok: false, message: "Impossible de contacter l'API" };
    }
  }

  async init2fa(payload: { userId: string }): Promise<ApiResult<Init2faApiData>> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/2fa/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || json?.success === false) {
        return { ok: false, message: json?.error?.message ?? "Init 2FA failed" };
      }

      return { ok: true, data: json.data as Init2faApiData };
    } catch {
      return { ok: false, message: "Impossible de contacter l'API" };
    }
  }

  async confirm2fa(payload: { userId: string; token: string }): Promise<ApiResult<Confirm2faApiData>> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/2fa/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || json?.success === false) {
        return { ok: false, message: json?.error?.message ?? "Confirm 2FA failed" };
      }

      return { ok: true, data: json.data as Confirm2faApiData };
    } catch {
      return { ok: false, message: "Impossible de contacter l'API" };
    }
  }

  async verify2fa(payload: { pendingToken: string; token: string }): Promise<ApiResult<Verify2faApiData>> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/2fa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || json?.success === false) {
        return { ok: false, message: json?.error?.message ?? "Verify 2FA failed" };
      }

      return { ok: true, data: json.data as Verify2faApiData };
    } catch {
      return { ok: false, message: "Impossible de contacter l'API" };
    }
  }

  async backup2fa(payload: { pendingToken: string; code: string }): Promise<ApiResult<Backup2faApiData>> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/2fa/backup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || json?.success === false) {
        return { ok: false, message: json?.error?.message ?? "Backup code failed" };
      }

      return { ok: true, data: json.data as Backup2faApiData };
    } catch {
      return { ok: false, message: "Impossible de contacter l'API" };
    }
  }

  async disable2fa(payload: { userId: string }): Promise<ApiResult<Disable2faApiData>> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/2fa`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || json?.success === false) {
        return { ok: false, message: json?.error?.message ?? "Disable 2FA failed" };
      }

      return { ok: true, data: json.data as Disable2faApiData };
    } catch {
      return { ok: false, message: "Impossible de contacter l'API" };
    }
  }

  async getMe(): Promise<ApiResult<MeApiData>> {
    try {
      const res = await fetch(`${this.baseUrl}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || json?.success === false) {
        return { ok: false, message: json?.error?.message ?? "Get me failed" };
      }

      localStorage.setItem("user", JSON.stringify(json.data));
      return { ok: true, data: json.data as MeApiData };
    } catch {
      return { ok: false, message: "Impossible de contacter l'API" };
    }
  }
}