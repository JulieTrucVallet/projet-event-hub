import { render, type RenderOptions } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { createTestStore } from "./test-environments";

export function renderWithStore(
  ui: React.ReactElement,
  config?: {
    initialState?: any;
    dependencies?: any;
    renderOptions?: Omit<RenderOptions, "wrapper">;
  }
) {
  const store = createTestStore({
    initialState: config?.initialState,
    dependencies: config?.dependencies,
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...config?.renderOptions }),
  };
}