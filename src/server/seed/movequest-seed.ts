import { randomUUID } from "node:crypto";
import { getDb } from "../db";

function clearMoveQuestTables() {
  const db = getDb();

  db.exec(`
    DELETE FROM milestones;
    DELETE FROM badges;
    DELETE FROM challenges;
    DELETE FROM tasks;
    DELETE FROM team_members;
    DELETE FROM teams;
    DELETE FROM users;
  `);
}

export function resetMoveQuestSeed() {
  clearMoveQuestTables();
  return seedMoveQuest();
}

export function seedMoveQuest() {
  const db = getDb();
  const existingUser = db
    .prepare("SELECT id FROM users WHERE name = ?")
    .get("林夏") as { id: string } | undefined;

  if (existingUser) {
    return existingUser.id;
  }

  const userId = randomUUID();
  const teamId = randomUUID();

  db.prepare(
    `INSERT INTO users (
      id, name, persona_label, level, current_xp, next_level_xp, streak_days, total_workouts, total_wins, total_distance, coins
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(userId, "林夏", "坚持型选手", 6, 218, 290, 6, 36, 4, 100, 168);

  db.prepare(
    `INSERT INTO teams (id, name, campus_label, completion_rate, weekly_goal, weekly_progress)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(teamId, "紫色脉冲", "3 号宿舍 • 上升中", 84, "本周目标：人均完成 3 次运动", 0.84);

  const insertMember = db.prepare(
    `INSERT INTO team_members (id, team_id, user_id, display_name, status_label, accent, is_current)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );

  [
    [randomUUID(), teamId, null, "Ava", "今天已完成", "#B9A7FF", 0],
    [randomUUID(), teamId, null, "Ming", "正在操场", "#F0D8A8", 0],
    [randomUUID(), teamId, null, "Lena", "还差 1 项", "#F7E1EA", 0],
    [randomUUID(), teamId, userId, "你", "连胜队长", "#D6EAD8", 1],
  ].forEach((member) => insertMember.run(...member));

  const insertTask = db.prepare(
    `INSERT INTO tasks (id, user_id, title, duration, completion_hint, completed, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );

  [
    [randomUUID(), userId, "晨跑", "20 分钟", "连续慢跑 20 分钟后返回打卡", 0, 1],
    [randomUUID(), userId, "喝水 + 拉伸", "10 分钟", "完成补水并拉伸 10 分钟后打卡", 0, 2],
    [randomUUID(), userId, "夜间散步", "30 分钟", "累计步行 30 分钟并返回打卡", 0, 3],
  ].forEach((task) => insertTask.run(...task));

  const insertChallenge = db.prepare(
    `INSERT INTO challenges (id, team_id, title, description, accent, remaining)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );

  [
    [randomUUID(), teamId, "宿舍冲榜赛", "按宿舍统计本周完成率", "#F2ECFF", "剩余 3 天"],
    [randomUUID(), null, "班级步数赛", "按班级累计步数排行", "#FFF1D7", null],
    [randomUUID(), null, "夜跑接力", "完成夜跑任务接力点亮地图", "#F7E1EA", null],
  ].forEach((challenge) => insertChallenge.run(...challenge));

  const insertBadge = db.prepare(
    `INSERT INTO badges (id, user_id, title, accent) VALUES (?, ?, ?, ?)`,
  );

  [
    [randomUUID(), userId, "7 天连胜", "#F2ECFF"],
    [randomUUID(), userId, "小队支点", "#FFF1D7"],
    [randomUUID(), userId, "晨间启动", "#F7E1EA"],
    [randomUUID(), userId, "步数收集者", "#E3F0E5"],
  ].forEach((badge) => insertBadge.run(...badge));

  const insertMilestone = db.prepare(
    `INSERT INTO milestones (id, user_id, title, status) VALUES (?, ?, ?, ?)`,
  );

  [
    [randomUUID(), userId, "30 次运动", "已完成"],
    [randomUUID(), userId, "步行 100 km", "完成 82%"],
    [randomUUID(), userId, "4 次小队获胜", "下一项"],
  ].forEach((milestone) => insertMilestone.run(...milestone));

  return userId;
}
