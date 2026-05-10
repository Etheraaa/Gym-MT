import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage", () => {
  it("shows the MoveQuest shell title", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "MoveQuest" }),
    ).toBeInTheDocument();
  });
});
