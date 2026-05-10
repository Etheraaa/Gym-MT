import { GET } from "./route";
import { resetMoveQuestSeed } from "@/server/seed/movequest-seed";

describe("GET /api/bootstrap", () => {
  beforeEach(() => {
    resetMoveQuestSeed();
  });

  it("returns the seeded payload for the mobile app", async () => {
    const response = await GET();
    const payload = await response.json();

    expect(payload.user.name).toBe("林夏");
    expect(payload.user.coins).toBe(168);
    expect(payload.home.tasks).toHaveLength(3);
    expect(payload.team.name).toBe("紫色脉冲");
    expect(payload.challenge.items).toHaveLength(3);
    expect(payload.achievements.badges).toHaveLength(4);
    expect(payload.achievements.lockedBadges).toHaveLength(2);
  });
});
