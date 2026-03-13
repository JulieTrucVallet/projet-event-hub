import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithStore } from "../../testing/render";
import { ProfileForm } from "./ProfileForm";

describe("ProfileForm", () => {
  it("Affiche les infos initiales", () => {
    renderWithStore(<ProfileForm />);
    expect(screen.getByDisplayValue("Julie")).toBeInTheDocument();
    expect(screen.getByDisplayValue("TV")).toBeInTheDocument();
    expect(screen.getByDisplayValue("julie@mail.com")).toBeInTheDocument();
  });

  it("Permet un update et affiche un succès", async () => {
    const user = userEvent.setup();
    renderWithStore(<ProfileForm />);

    const email = screen.getByLabelText("Email");
    await user.clear(email);
    await user.type(email, "julie2@mail.com");

    const btn = screen.getByRole("button", { name: /enregistrer/i });
    await user.click(btn);

    expect(await screen.findByText(/profil mis à jour/i)).toBeInTheDocument();
  });
});