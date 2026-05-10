import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveDbFilePath } from "./db";

describe("resolveDbFilePath", () => {
  it("uses the default local sqlite path when no env var is provided", () => {
    const cwd = "/workspace/movequest";

    expect(resolveDbFilePath({}, cwd)).toBe(path.join(cwd, "data", "movequest.db"));
  });

  it("uses an absolute MOVEQUEST_DB_PATH as-is", () => {
    expect(resolveDbFilePath({ MOVEQUEST_DB_PATH: "/data/movequest.db" }, "/workspace/movequest")).toBe(
      "/data/movequest.db",
    );
  });

  it("resolves a relative MOVEQUEST_DB_PATH against the current working directory", () => {
    const cwd = "/workspace/movequest";

    expect(resolveDbFilePath({ MOVEQUEST_DB_PATH: "runtime/movequest.db" }, cwd)).toBe(
      path.join(cwd, "runtime", "movequest.db"),
    );
  });
});
