import { render, type RenderOptions } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import type { Dependencies } from "../store/dependencies";
import { createTestStore } from "./test-environments";

export function renderWithStore(
  ui: React.ReactElement,
  config?: {
    initialState?: Record<string, unknown>;
    dependencies?: Dependencies;
    renderOptions?: Omit<RenderOptions, "wrapper">;
  }
) {
  const store = createTestStore({
    initialState: config?.initialState,
    dependencies: config?.dependencies,
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...config?.renderOptions }),
  };
}