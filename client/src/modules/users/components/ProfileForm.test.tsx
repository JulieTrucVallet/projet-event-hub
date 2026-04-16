import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithStore } from "../../testing/render";
import { ProfileForm } from "./ProfileForm";

describe("ProfileForm", () => {
  beforeEach(() => {
    localStorage.clear();

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "u1",
        firstname: "Julie",
        lastname: "TV",
        email: "julie@mail.com",
        otpEnabled: false,
      })
    );
  });

  it("Affiche les infos initiales", () => {
    renderWithStore(<ProfileForm />);

    expect(screen.getByDisplayValue("Julie")).toBeInTheDocument();
    expect(screen.getByDisplayValue("TV")).toBeInTheDocument();
    expect(screen.getByDisplayValue("julie@mail.com")).toBeInTheDocument();
  });

  it("Permet un update et affiche un succès", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          id: "u1",
          firstname: "Julie",
          lastname: "TV",
          email: "julie2@mail.com",
          otpEnabled: false,
        },
      }),
    } as Response);

    renderWithStore(<ProfileForm />);

    const email = screen.getByLabelText("Email");
    await user.clear(email);
    await user.type(email, "julie2@mail.com");

    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    expect(await screen.findByText(/profil mis à jour/i)).toBeInTheDocument();

    fetchMock.mockRestore();
  });
});