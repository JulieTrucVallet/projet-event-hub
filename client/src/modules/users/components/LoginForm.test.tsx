import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithStore } from "../../testing/render";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("Désactive le bouton tant que email/password invalides", () => {
    renderWithStore(<LoginForm />);
    expect(screen.getByRole("button", { name: /se connecter/i })).toBeDisabled();
  });

  it("Affiche une erreur si mauvais mot de passe", async () => {
    const user = userEvent.setup();
    renderWithStore(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "julie@mail.com");
    await user.type(screen.getByLabelText("Mot de passe"), "badpass");

    const btn = screen.getByRole("button", { name: /se connecter/i });
    expect(btn).toBeEnabled();

    await user.click(btn);

    expect(await screen.findByText(/identifiants invalides/i)).toBeInTheDocument();
  });
});