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
    tasks: Array<{
      title: string;
      duration: string;
      completed: boolean;
      completionHint: string;
      serverTaskTitle?: string;
    }>;
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
