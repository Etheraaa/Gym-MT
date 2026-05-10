import { getDb } from "../db";
import { seedMoveQuest } from "../seed/movequest-seed";

export type BootstrapPayload = {
  user: {
    name: string;
    personaLabel: string;
    level: number;
    currentXp: number;
    nextLevelXp: number;
    streakDays: number;
    totalWorkouts: number;
    totalWins: number;
    totalDistance: number;
    coins: number;
  };
  home: {
    completionRate: number;
    tasks: Array<{ title: string; duration: string; completed: boolean; completionHint: string }>;
  };
  team: {
    name: string;
    campusLabel: string;
    completionRate: number;
    weeklyGoal: string;
    weeklyProgress: number;
    members: Array<{ display: string; status: string; accent: string; isCurrent: boolean }>;
  };
  challenge: {
    heroTitle: string;
    heroDescription: string;
    remaining: string;
    items: Array<{ title: string; description: string; accent: string }>;
  };
  achievements: {
    levelTitle: string;
    badges: Array<{ title: string; accent: string }>;
    lockedBadges: Array<{
      title: string;
      condition: string;
      progress: string;
      reward: string;
    }>;
    milestones: Array<{ title: string; status: string }>;
  };
};

const lockedBadges = [
  {
    title: "14 天连胜",
    condition: "解锁条件：连续 14 天完成至少 1 项运动任务",
    progress: "当前进度：7 / 14 天",
    reward: "奖励：+30 Quest Coins",
  },
  {
    title: "挑战冲榜者",
    condition: "解锁条件：获得 1 次校园挑战赛周冠军",
    progress: "当前进度：还差 1 次获胜",
    reward: "奖励：+80 Quest Coins",
  },
];

async function ensureSeeded() {
  seedMoveQuest();
}

export async function getBootstrapPayload(): Promise<BootstrapPayload> {
  await ensureSeeded();
  const db = getDb();

  const user = db
    .prepare(
      `SELECT id, name, persona_label, level, current_xp, next_level_xp, streak_days, total_workouts, total_wins, total_distance, coins
       FROM users WHERE name = ?`,
    )
    .get("林夏") as {
    id: string;
    name: string;
    persona_label: string;
    level: number;
    current_xp: number;
    next_level_xp: number;
    streak_days: number;
    total_workouts: number;
    total_wins: number;
    total_distance: number;
    coins: number;
  };

  const tasks = db
    .prepare(
      `SELECT title, duration, completion_hint, completed, display_order FROM tasks WHERE user_id = ? ORDER BY display_order ASC`,
    )
    .all(user.id) as Array<{
    title: string;
    duration: string;
    completion_hint: string;
    completed: number;
    display_order: number;
  }>;

  const team = db
    .prepare(
      `SELECT id, name, campus_label, completion_rate, weekly_goal, weekly_progress FROM teams WHERE name = ?`,
    )
    .get("紫色脉冲") as {
    id: string;
    name: string;
    campus_label: string;
    completion_rate: number;
    weekly_goal: string;
    weekly_progress: number;
  };

  const members = db
    .prepare(
      `SELECT display_name, status_label, accent, is_current FROM team_members WHERE team_id = ? ORDER BY is_current ASC, display_name ASC`,
    )
    .all(team.id) as Array<{ display_name: string; status_label: string; accent: string; is_current: number }>;

  const challenges = db
    .prepare(
      `SELECT title, description, accent, remaining FROM challenges ORDER BY rowid ASC`,
    )
    .all() as Array<{ title: string; description: string; accent: string; remaining: string | null }>;

  const badges = db
    .prepare(`SELECT title, accent FROM badges WHERE user_id = ? ORDER BY rowid ASC`)
    .all(user.id) as Array<{ title: string; accent: string }>;

  const milestones = db
    .prepare(`SELECT title, status FROM milestones WHERE user_id = ? ORDER BY rowid ASC`)
    .all(user.id) as Array<{ title: string; status: string }>;

  const completedTasks = tasks.filter((task) => Boolean(task.completed)).length;
  const heroChallenge = challenges.find((challenge) => challenge.remaining) ?? challenges[0];

  return {
    user: {
      name: user.name,
      personaLabel: user.persona_label,
      level: user.level,
      currentXp: user.current_xp,
      nextLevelXp: user.next_level_xp,
      streakDays: user.streak_days,
      totalWorkouts: user.total_workouts,
      totalWins: user.total_wins,
      totalDistance: user.total_distance,
      coins: user.coins,
    },
    home: {
      completionRate: tasks.length === 0 ? 0 : completedTasks / tasks.length,
      tasks: tasks.map((task) => ({
        title: task.title,
        duration: task.duration,
        completionHint: task.completion_hint,
        completed: Boolean(task.completed),
      })),
    },
    team: {
      name: team.name,
      campusLabel: team.campus_label,
      completionRate: team.completion_rate,
      weeklyGoal: team.weekly_goal,
      weeklyProgress: team.weekly_progress,
      members: members.map((member) => ({
        display: member.display_name,
        status: member.status_label,
        accent: member.accent,
        isCurrent: Boolean(member.is_current),
      })),
    },
    challenge: {
      heroTitle: "考试周解压挑战",
      heroDescription: "连续 7 天完成轻运动，宿舍队伍一起冲榜。",
      remaining: heroChallenge?.remaining ?? "进行中",
      items: challenges.map((challenge) => ({
        title: challenge.title,
        description: challenge.description,
        accent: challenge.accent,
      })),
    },
    achievements: {
      levelTitle: "坚持构建者",
      badges: badges.map((badge) => ({
        title: badge.title,
        accent: badge.accent,
      })),
      lockedBadges,
      milestones: milestones.map((milestone) => ({
        title: milestone.title,
        status: milestone.status,
      })),
    },
  };
}

export async function completeTaskAndRefresh(taskTitle: string): Promise<BootstrapPayload> {
  await ensureSeeded();
  const db = getDb();

  const user = db
    .prepare(`SELECT id, current_xp, total_workouts, coins FROM users WHERE name = ?`)
    .get("林夏") as { id: string; current_xp: number; total_workouts: number; coins: number };

  const target = db
    .prepare(`SELECT id, completed FROM tasks WHERE user_id = ? AND title = ?`)
    .get(user.id, taskTitle) as { id: string; completed: number } | undefined;

  if (!target) {
    throw new Error(`Task not found: ${taskTitle}`);
  }

  if (!target.completed) {
    db.prepare(`UPDATE tasks SET completed = 1 WHERE id = ?`).run(target.id);
    db.prepare(
      `UPDATE users SET current_xp = ?, total_workouts = ?, coins = ? WHERE id = ?`,
    ).run(user.current_xp + 18, user.total_workouts + 1, user.coins + 12, user.id);
  }

  return getBootstrapPayload();
}
