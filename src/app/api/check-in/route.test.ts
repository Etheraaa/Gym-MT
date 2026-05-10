import { POST } from "./route";
import { resetMoveQuestSeed } from "@/server/seed/movequest-seed";

describe("POST /api/check-in", () => {
  beforeEach(() => {
    resetMoveQuestSeed();
  });

  it("marks the requested task complete and returns refreshed metrics", async () => {
    const request = new Request("http://localhost/api/check-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskTitle: "夜间散步" }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(
      payload.home.tasks.find((task: { title: string }) => task.title === "夜间散步"),
    ).toMatchObject({
      title: "夜间散步",
      completed: true,
    });
    expect(payload.home.tasks.filter((task: { completed: boolean }) => task.completed)).toHaveLength(1);
    expect(payload.user.totalWorkouts).toBeGreaterThan(36);
    expect(payload.user.coins).toBe(180);
  });
});
