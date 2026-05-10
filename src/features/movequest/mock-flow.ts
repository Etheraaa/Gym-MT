import type { BootstrapPayload } from "./types";

export const mockBootstrap: BootstrapPayload = {
  user: {
    name: "林夏",
    personaLabel: "坚持型选手",
    level: 6,
    currentXp: 218,
    nextLevelXp: 290,
    streakDays: 6,
    totalWorkouts: 36,
    totalWins: 4,
    totalDistance: 100,
    coins: 168,
  },
  home: {
    completionRate: 0,
    tasks: [
      { title: "晨跑", duration: "20 分钟", completed: false, completionHint: "连续慢跑 20 分钟后返回打卡" },
      { title: "喝水 + 拉伸", duration: "10 分钟", completed: false, completionHint: "完成补水并拉伸 10 分钟后打卡" },
      { title: "夜间散步", duration: "30 分钟", completed: false, completionHint: "累计步行 30 分钟并返回打卡" },
    ],
  },
  team: {
    name: "紫色脉冲",
    campusLabel: "3 号宿舍 • 上升中",
    completionRate: 84,
    weeklyGoal: "本周目标：人均完成 3 次运动",
    weeklyProgress: 0.84,
    members: [
      { display: "Ava", status: "今天已完成", accent: "#B9A7FF", isCurrent: false },
      { display: "Ming", status: "正在操场", accent: "#F0D8A8", isCurrent: false },
      { display: "Lena", status: "还差 1 项", accent: "#F7E1EA", isCurrent: false },
      { display: "你", status: "连胜队长", accent: "#D6EAD8", isCurrent: true },
    ],
  },
  challenge: {
    heroTitle: "考试周解压挑战",
    heroDescription: "连续 7 天完成轻运动，宿舍队伍一起冲榜。",
    remaining: "剩余 3 天",
    items: [
      { title: "宿舍冲榜赛", description: "按宿舍统计本周完成率", accent: "#F2ECFF" },
      { title: "班级步数赛", description: "按班级累计步数排行", accent: "#FFF1D7" },
      { title: "夜跑接力", description: "完成夜跑任务接力点亮地图", accent: "#F7E1EA" },
    ],
  },
  achievements: {
    levelTitle: "坚持构建者",
    badges: [
      { title: "7 天连胜", accent: "#F2ECFF" },
      { title: "小队支点", accent: "#FFF1D7" },
      { title: "晨间启动", accent: "#F7E1EA" },
      { title: "步数收集者", accent: "#E3F0E5" },
    ],
    lockedBadges: [
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
    ],
    milestones: [
      { title: "30 次运动", status: "已完成" },
      { title: "步行 100 km", status: "完成 82%" },
      { title: "4 次小队获胜", status: "下一项" },
    ],
  },
};
