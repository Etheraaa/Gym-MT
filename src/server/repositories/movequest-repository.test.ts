import {
  completeTaskAndRefresh,
  getBootstrapPayload,
} from "./movequest-repository";
import { resetMoveQuestSeed } from "../seed/movequest-seed";

describe("movequest repository", () => {
  beforeEach(() => {
    resetMoveQuestSeed();
  });

  it("loads the seeded bootstrap payload for the main flow", async () => {
    const payload = await getBootstrapPayload();

    expect(payload.user.name).toBe("林夏");
    expect(payload.user.coins).toBe(168);
    expect(payload.home.tasks).toHaveLength(3);
    expect(payload.home.tasks[0]).toMatchObject({
      title: "晨跑",
      completed: false,
      completionHint: "连续慢跑 20 分钟后返回打卡",
    });
    expect(payload.team.members).toHaveLength(4);
    expect(payload.challenge.items[0].title).toBe("宿舍冲榜赛");
    expect(payload.achievements.badges[0].title).toBe("7 天连胜");
    expect(payload.achievements.lockedBadges[0].title).toBe("14 天连胜");
  });

  it("marks a task complete and returns updated home metrics", async () => {
    const payload = await getBootstrapPayload();
    const openTask = payload.home.tasks.find((task) => !task.completed);

    expect(openTask).toBeDefined();

    const updated = await completeTaskAndRefresh(openTask!.title);

    expect(updated.home.tasks.find((task) => task.title === openTask!.title)?.completed).toBe(true);
    expect(updated.home.tasks.filter((task) => task.completed)).toHaveLength(1);
    expect(updated.user.coins).toBe(180);
  });
});
