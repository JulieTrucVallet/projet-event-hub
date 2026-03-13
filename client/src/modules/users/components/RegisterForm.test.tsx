import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithStore } from "../../testing/render";
import { RegisterForm } from "./RegisterForm";

describe("RegisterForm", () => {
  it("Ne peut pas être soumis tant que tous les champs ne sont pas remplis", async () => {
    renderWithStore(<RegisterForm />);

    const btn = screen.getByRole("button", { name: /créer/i });
    expect(btn).toBeDisabled();
  });

  it("Reste désactivé si le mot de passe ne respecte pas les critères", async () => {
    const user = userEvent.setup();
    renderWithStore(<RegisterForm />);

    await user.type(screen.getByLabelText("Prénom"), "Julie");
    await user.type(screen.getByLabelText("Nom"), "TV");
    await user.type(screen.getByLabelText(/email/i), "julie@mail.com");

    await user.type(screen.getByLabelText(/mot de passe/i), "Aa1!");

    const btn = screen.getByRole("button", { name: /créer/i });
    expect(btn).toBeDisabled();
  });

  it("Devient activable quand tous les champs sont remplis et password valide", async () => {
    const user = userEvent.setup();
    renderWithStore(<RegisterForm />);

    await user.type(screen.getByLabelText("Prénom"), "Julie");
    await user.type(screen.getByLabelText("Nom"), "TV");
    await user.type(screen.getByLabelText(/email/i), "julie@mail.com");

    await user.type(screen.getByLabelText(/mot de passe/i), "Abcdefghij1!");

    const btn = screen.getByRole("button", { name: /créer/i });
    expect(btn).toBeEnabled();
  });
});