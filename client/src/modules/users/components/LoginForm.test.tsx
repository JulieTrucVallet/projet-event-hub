import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithStore } from "../../testing/render";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Désactive le bouton tant que email/password invalides", () => {
    renderWithStore(<LoginForm />);
    expect(screen.getByRole("button", { name: /se connecter/i })).toBeDisabled();
  });

  it("Affiche une erreur si mauvais mot de passe", async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        error: {
          message: "Identifiants invalides",
        },
      }),
    } as Response);

    renderWithStore(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "julie@mail.com");
    await user.type(screen.getByLabelText(/mot de passe/i), "badpass");
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    expect(await screen.findByText(/identifiants invalides/i)).toBeInTheDocument();
  });
});