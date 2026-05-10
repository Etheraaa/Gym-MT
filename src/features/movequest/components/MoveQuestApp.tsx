"use client";

import React from "react";
import type { BootstrapPayload } from "../types";

type MoveQuestAppProps = {
  initialData: BootstrapPayload;
  onCheckIn?: (taskTitle: string) => Promise<BootstrapPayload>;
  bootstrapPath?: string | null;
  checkInPath?: string | null;
};

type AppTab = "home" | "team" | "challenge" | "store" | "me";
type AppStage = "onboarding-1" | "onboarding-2" | "goal" | "team-setup" | "app" | "success";
type GoalKey = "减压放松" | "规律生活" | "提升体能" | "塑形管理";
type StoreItem = {
  title: string;
  description: string;
  price: number;
  rewardSource?: string;
};

const goalTaskPacks: Record<
  GoalKey,
  {
    heroPrompt: string;
    tasks: Array<{ title: string; duration: string; completionHint: string }>;
  }
> = {
  减压放松: {
    heroPrompt: "用轻运动把压力慢慢放掉，今天先照顾好自己的节奏。",
    tasks: [
      { title: "睡前散步", duration: "25 分钟", completionHint: "在校园里轻松步行 25 分钟后返回打卡" },
      { title: "呼吸放松", duration: "8 分钟", completionHint: "完成 8 分钟深呼吸或冥想放松后打卡" },
      { title: "肩颈拉伸", duration: "12 分钟", completionHint: "完成一组舒缓肩颈拉伸并保持 12 分钟" },
    ],
  },
  规律生活: {
    heroPrompt: "把今天拆成几个稳定的小动作，让运动自然发生。",
    tasks: [
      { title: "晨间唤醒", duration: "10 分钟", completionHint: "起床后完成 10 分钟唤醒活动再打卡" },
      { title: "喝水 + 拉伸", duration: "10 分钟", completionHint: "完成补水并拉伸 10 分钟后打卡" },
      { title: "晚间散步", duration: "20 分钟", completionHint: "晚饭后散步 20 分钟并返回打卡" },
    ],
  },
  提升体能: {
    heroPrompt: "今天重点拉一拉耐力，让身体比昨天再往前一点。",
    tasks: [
      { title: "间歇慢跑", duration: "20 分钟", completionHint: "完成 20 分钟间歇慢跑后返回打卡" },
      { title: "快走耐力", duration: "25 分钟", completionHint: "连续快走 25 分钟并保持呼吸稳定" },
      { title: "核心激活", duration: "12 分钟", completionHint: "完成一轮核心训练并坚持 12 分钟后打卡" },
    ],
  },
  塑形管理: {
    heroPrompt: "用轻力量和燃脂动作把今天的塑形感拉起来。",
    tasks: [
      { title: "轻力量循环", duration: "18 分钟", completionHint: "完成一轮深蹲、弓步和支撑循环后打卡" },
      { title: "燃脂跟练", duration: "15 分钟", completionHint: "跟练一段 15 分钟燃脂操并返回打卡" },
      { title: "下肢塑形拉伸", duration: "12 分钟", completionHint: "完成一组下肢塑形拉伸并保持 12 分钟" },
    ],
  },
};

const memberDetailMap = {
  Ava: {
    lastCheckIn: "今天 07:45",
    contribution: "12 活跃值",
    tasks: [
      { title: "晨跑", status: "已完成" },
      { title: "喝水 + 拉伸", status: "已完成" },
      { title: "晚间散步", status: "已完成" },
    ],
  },
  Lena: {
    lastCheckIn: "今天 18:20",
    contribution: "8 活跃值",
    tasks: [
      { title: "晨间唤醒", status: "已完成" },
      { title: "喝水 + 拉伸", status: "进行中" },
      { title: "晚间散步", status: "未开始" },
    ],
  },
  Ming: {
    lastCheckIn: "今天 16:30",
    contribution: "10 活跃值",
    tasks: [
      { title: "间歇慢跑", status: "进行中" },
      { title: "核心激活", status: "未开始" },
      { title: "快走耐力", status: "未开始" },
    ],
  },
  你: {
    lastCheckIn: "今天 20:10",
    contribution: "15 活跃值",
    tasks: [
      { title: "夜间散步", status: "已完成" },
      { title: "呼吸放松", status: "已完成" },
      { title: "肩颈拉伸", status: "进行中" },
    ],
  },
} as const;

const challengeDetailMap = {
  宿舍冲榜赛: {
    rule: "按宿舍一周内平均完成率进行排名，每晚 10 点刷新。",
    ranking: "统计宿舍成员完成任务数 / 应完成任务数，取周均值。",
    reward: "奖励：周冠军宿舍解锁发光徽章和分享海报",
    progress: "当前进度：3 号宿舍排名第 2，距离第 1 名差 4%。",
  },
  班级步数赛: {
    rule: "按班级成员累计步数排名，步数每天同步一次。",
    ranking: "班级总步数越高，排名越靠前。",
    reward: "奖励：班级榜前三解锁限定步数勋章。",
    progress: "当前进度：你所在班级暂列第 5 名。",
  },
  夜跑接力: {
    rule: "完成夜跑任务即可点亮接力地图上的一个站点。",
    ranking: "点亮站点数越多，队伍越靠前。",
    reward: "奖励：全图点亮后解锁夜跑接力纪念卡。",
    progress: "当前进度：已点亮 8/20 个夜跑站点。",
  },
} as const;

const badgeDetailMap = {
  "7 天连胜": {
    condition: "获得条件：连续 7 天完成至少 1 项运动任务",
    reason: "获得说明：你已经连续一周保持打卡，没有让自己的节奏掉线。",
    earnedAt: "获得时间：2026.05.08",
    description: "勋章说明：奖励持续稳定的坚持，而不是短期爆发。",
  },
  小队支点: {
    condition: "获得条件：连续 3 次成为小队当日贡献前三",
    reason: "获得说明：你在关键几天里撑起了小队节奏。",
    earnedAt: "获得时间：2026.05.01",
    description: "勋章说明：强调团队中的稳定带动作用。",
  },
  晨间启动: {
    condition: "获得条件：累计完成 5 次晨间任务",
    reason: "获得说明：你已经形成了稳定的晨间启动习惯。",
    earnedAt: "获得时间：2026.04.27",
    description: "勋章说明：鼓励把运动嵌进每天开始的时刻。",
  },
  步数收集者: {
    condition: "获得条件：累计步行达到 80 km",
    reason: "获得说明：你已经把轻步行变成了真实的日常积累。",
    earnedAt: "获得时间：2026.04.20",
    description: "勋章说明：奖励低门槛但高持续性的运动方式。",
  },
} as const;

const storeCatalog: StoreItem[] = [
  {
    title: "打卡烟花特效",
    description: "让成功打卡页出现一段柔和烟花庆祝动画。",
    price: 60,
    rewardSource: "打卡完成可获得 +12 Quest Coins",
  },
  {
    title: "小队气泡主题",
    description: "把小队状态卡换成更轻盈的渐变主题。",
    price: 90,
    rewardSource: "获得勋章可获得 +30 Quest Coins",
  },
  {
    title: "冠军宿舍称号",
    description: "在分享卡片上展示本周限定的冠军称号。",
    price: 120,
    rewardSource: "挑战赛获奖可获得 +80 Quest Coins",
  },
];

const shellStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 16px",
  background:
    "radial-gradient(circle at top right, rgba(185,167,255,0.24), transparent 20%), radial-gradient(circle at bottom left, rgba(240,216,168,0.18), transparent 22%), #f6f3ef",
};

const phoneStyle: React.CSSProperties = {
  width: 390,
  minHeight: 844,
  borderRadius: 34,
  border: "1px solid #e7e0d8",
  background: "#fbfaf8",
  boxShadow: "0 24px 60px rgba(40, 32, 20, 0.08)",
  padding: 24,
  position: "relative",
  overflow: "hidden",
};

const cardStyle: React.CSSProperties = {
  background: "#fffdfc",
  border: "1px solid #eae4dd",
  borderRadius: 28,
  padding: 20,
  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.04)",
};

const primaryButtonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 999,
  background: "#171717",
  color: "#ffffff",
  padding: "14px 20px",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  borderRadius: 999,
  border: "1px solid #e7e0d8",
  background: "#ffffff",
  color: "#6a635d",
  padding: "12px 18px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const tabNames: Array<{ key: AppTab; label: string }> = [
  { key: "home", label: "首页" },
  { key: "team", label: "小队" },
  { key: "challenge", label: "挑战" },
  { key: "store", label: "商城" },
  { key: "me", label: "我的" },
];

function getOpenTask(payload: BootstrapPayload) {
  return payload.home.tasks.find((task) => !task.completed) ?? payload.home.tasks[0];
}

function getTaskByTitle(payload: BootstrapPayload, title: string | null) {
  if (!title) {
    return null;
  }

  return payload.home.tasks.find((task) => task.title === title) ?? null;
}

function applyGoalTaskPack(payload: BootstrapPayload, selectedGoal: GoalKey): BootstrapPayload {
  const pack = goalTaskPacks[selectedGoal];

  return {
    ...payload,
    home: {
      ...payload.home,
      tasks: pack.tasks.map((task, index) => ({
        ...task,
        completed: payload.home.tasks[index]?.completed ?? false,
        serverTaskTitle: payload.home.tasks[index]?.serverTaskTitle ?? payload.home.tasks[index]?.title ?? task.title,
      })),
    },
  };
}

function toAbsolutePath(pathname: string) {
  if (/^https?:\/\//.test(pathname)) {
    return pathname;
  }

  if (typeof window !== "undefined") {
    return new URL(pathname, window.location.origin).toString();
  }

  return pathname;
}

function OnboardingStep({
  title,
  description,
  buttonLabel,
  onNext,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onNext: () => void;
}) {
  return (
    <section style={{ display: "grid", gap: 24, paddingTop: 100 }}>
      <div
        style={{
          width: 132,
          height: 132,
          borderRadius: "50%",
          margin: "0 auto",
          background: "rgba(185,167,255,0.22)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: "50%",
            background: "#b9a7ff",
          }}
        />
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 34, lineHeight: "42px" }}>{title}</h1>
        <p style={{ margin: 0, color: "#706a64", fontSize: 16, lineHeight: "24px" }}>
          {description}
        </p>
      </div>
      <button type="button" style={primaryButtonStyle} onClick={onNext}>
        {buttonLabel}
      </button>
    </section>
  );
}

function GoalSelect({
  selectedGoal,
  onSelect,
  onNext,
}: {
  selectedGoal: GoalKey;
  onSelect: (goal: GoalKey) => void;
  onNext: () => void;
}) {
  const goals: Array<[GoalKey, string]> = [
    ["减压放松", "用散步和轻运动缓解学习压力"],
    ["规律生活", "建立每天动一动的稳定节奏"],
    ["提升体能", "从基础耐力开始慢慢进步"],
    ["塑形管理", "把轻健身和打卡结合起来"],
  ];

  return (
    <section style={{ display: "grid", gap: 20, paddingTop: 48 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 32, lineHeight: "38px" }}>选择目标</h1>
        <p style={{ margin: "12px 0 0", color: "#706a64" }}>先决定你想坚持什么样的运动节奏。</p>
      </div>
      <div style={{ ...cardStyle, display: "grid", gap: 14 }}>
        {goals.map(([title, desc]) => {
          const isSelected = selectedGoal === title;

          return (
            <button
              key={title}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(title)}
              style={{
                width: "100%",
                borderRadius: 24,
                border: `1px solid ${isSelected ? "#6ca8ff" : "#efe7de"}`,
                background: isSelected ? "#dfeaff" : "#fffefc",
                padding: 18,
                display: "grid",
                gap: 8,
                textAlign: "left",
                cursor: "pointer",
                color: "#171717",
                appearance: "none",
                boxShadow: "none",
              }}
            >
              <strong>{title}</strong>
              <span style={{ color: "#7e7770", fontSize: 13 }}>{desc}</span>
            </button>
          );
        })}
      </div>
      <button type="button" style={primaryButtonStyle} onClick={onNext}>
        继续并创建小队
      </button>
    </section>
  );
}

function TeamSetup({
  payload,
  onNext,
}: {
  payload: BootstrapPayload;
  onNext: () => void;
}) {
  return (
    <section style={{ display: "grid", gap: 20, paddingTop: 48 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 32, lineHeight: "38px" }}>创建小队</h1>
        <p style={{ margin: "12px 0 0", color: "#706a64" }}>把室友、同学或朋友变成你的陪跑队友。</p>
      </div>
      <div style={cardStyle}>
        <p style={{ margin: 0, color: "#8a817b", fontSize: 12 }}>你的新小队</p>
        <h2 style={{ margin: "10px 0 8px", fontSize: 28 }}>{payload.team.name}</h2>
        <p style={{ margin: 0, color: "#6f6862", fontSize: 14 }}>{payload.team.weeklyGoal}</p>
        <div
          style={{
            marginTop: 18,
            height: 8,
            borderRadius: 999,
            background: "#eee7df",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "36%",
              height: "100%",
              background: "#b9a7ff",
            }}
          />
        </div>
      </div>
      <div style={{ ...cardStyle, display: "grid", gap: 12 }}>
        <strong>邀请成员</strong>
        <div style={{ display: "grid", gap: 10 }}>
          {payload.team.members.map((member) => (
            <div
              key={member.display}
              style={{
                borderRadius: 24,
                border: "1px solid #efe7de",
                padding: "12px 16px",
                background: "#fffefc",
              }}
            >
              {member.display}
            </div>
          ))}
        </div>
      </div>
      <button type="button" style={primaryButtonStyle} onClick={onNext}>
        进入今日首页
      </button>
    </section>
  );
}

function BottomNav({
  activeTab,
  onChange,
}: {
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
}) {
  return (
    <nav
      aria-label="底部导航"
      style={{
        marginTop: "auto",
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 8,
        borderRadius: 28,
        border: "1px solid #eae4dd",
        background: "#fffdfb",
        padding: 14,
      }}
    >
      {tabNames.map((tab) => (
        <button
          key={tab.key}
          type="button"
          aria-pressed={activeTab === tab.key}
          onClick={() => onChange(tab.key)}
          style={{
            border: "none",
            background: "transparent",
            color: activeTab === tab.key ? "#171717" : "#98908a",
            fontWeight: activeTab === tab.key ? 700 : 500,
            padding: "8px 0",
            cursor: "pointer",
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

function HomeScreen({
  payload,
  selectedGoal,
  onCheckIn,
}: {
  payload: BootstrapPayload;
  selectedGoal: GoalKey | null;
  onCheckIn: (taskTitle: string) => void;
}) {
  const [planState, setPlanState] = React.useState<"idle" | "selecting" | "started">("idle");
  const [selectedTaskTitle, setSelectedTaskTitle] = React.useState<string | null>(null);

  const selectedTask = getTaskByTitle(payload, selectedTaskTitle);
  const openTasks = payload.home.tasks.filter((task) => !task.completed);

  const activePrompt =
    planState === "started" && selectedTask
      ? `正在进行：${selectedTask.title}`
      : selectedGoal
        ? goalTaskPacks[selectedGoal].heroPrompt
        : "完成 2 项运动，守住小队连胜。";

  return (
    <>
      <section style={{ display: "grid", gap: 14, paddingTop: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32, lineHeight: "38px" }}>星期四</h1>
          <p style={{ margin: "10px 0 0", color: "#706a64" }}>和你的队友一起把运动变成习惯。</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span style={{ ...secondaryButtonStyle, cursor: "default" }}>第 4 周</span>
          <span style={{ ...secondaryButtonStyle, background: "#f4eeff", color: "#7b69cc", cursor: "default" }}>
            {payload.team.campusLabel}
          </span>
        </div>
        <div style={cardStyle}>
          <p style={{ margin: 0, color: "#8a817b", fontSize: 12 }}>今日任务</p>
          <h2 style={{ margin: "10px 0 16px", fontSize: 24, lineHeight: "32px" }}>
            {activePrompt}
          </h2>
          {planState === "idle" ? (
            <button type="button" style={primaryButtonStyle} onClick={() => setPlanState("selecting")}>
              立即开始
            </button>
          ) : null}

          {planState === "selecting" ? (
            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <strong style={{ fontSize: 18 }}>选择今天想完成的任务</strong>
                <span style={{ color: "#8a837d", fontSize: 12 }}>先选一项开始，完成标准会显示在下方。</span>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {openTasks.map((task) => {
                  const isSelected = task.title === selectedTaskTitle;

                  return (
                    <button
                      key={task.title}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedTaskTitle(task.title)}
                      style={{
                        width: "100%",
                        borderRadius: 18,
                        border: `1px solid ${isSelected ? "#6ca8ff" : "#efe7de"}`,
                        background: isSelected ? "#dfeaff" : "#ffffff",
                        padding: "14px 16px",
                        display: "grid",
                        gap: 6,
                        textAlign: "left",
                        cursor: "pointer",
                        color: "#171717",
                        appearance: "none",
                      }}
                    >
                      <strong style={{ display: "block" }}>{task.title}</strong>
                      <span style={{ color: "#8c847d", fontSize: 12 }}>{task.duration}</span>
                    </button>
                  );
                })}
              </div>
              {selectedTask ? (
                <div
                  style={{
                    borderRadius: 18,
                    border: "1px solid #efe7de",
                    background: "#fffaf4",
                    padding: "14px 16px",
                    display: "grid",
                    gap: 6,
                  }}
                >
                  <strong>完成标准</strong>
                  <span style={{ color: "#6f6862", fontSize: 13, lineHeight: "20px" }}>
                    {selectedTask.completionHint}
                  </span>
                </div>
              ) : null}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  style={{
                    ...primaryButtonStyle,
                    opacity: selectedTask ? 1 : 0.45,
                    cursor: selectedTask ? "pointer" : "not-allowed",
                  }}
                  disabled={!selectedTask}
                  onClick={() => setPlanState("started")}
                >
                  开始这个任务
                </button>
                <button type="button" style={secondaryButtonStyle} onClick={() => setPlanState("idle")}>
                  稍后再说
                </button>
              </div>
            </div>
          ) : null}

          {planState === "started" && selectedTask ? (
            <div style={{ display: "grid", gap: 14 }}>
              <div
                style={{
                  borderRadius: 18,
                  border: "1px solid #d9ccff",
                  background: "#f8f4ff",
                  padding: "14px 16px",
                  display: "grid",
                  gap: 6,
                }}
              >
                <strong>正在进行：{selectedTask.title}</strong>
                <span style={{ color: "#6f6862", fontSize: 13 }}>{selectedTask.duration}</span>
                <span style={{ color: "#6f6862", fontSize: 13, lineHeight: "20px" }}>
                  {selectedTask.completionHint}
                </span>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="button" style={primaryButtonStyle} onClick={() => onCheckIn(selectedTask.title)}>
                  标记已完成
                </button>
                <button type="button" style={secondaryButtonStyle} onClick={() => setPlanState("selecting")}>
                  更换任务
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={cardStyle}>
            <p style={{ margin: 0, color: "#8a817b", fontSize: 12 }}>连续打卡</p>
            <strong style={{ display: "block", fontSize: 42, lineHeight: "46px", marginTop: 8 }}>
              {String(payload.user.streakDays).padStart(2, "0")}
            </strong>
            <span style={{ color: "#6f6862" }}>天没有断</span>
          </div>
          <div style={cardStyle}>
            <p style={{ margin: 0, color: "#8a817b", fontSize: 12 }}>小队达成</p>
            <strong style={{ display: "block", fontSize: 40, lineHeight: "44px", marginTop: 8 }}>
              {payload.team.completionRate}%
            </strong>
            <span style={{ color: "#6f6862" }}>本周完成率</span>
          </div>
        </div>
        <div style={{ ...cardStyle, display: "grid", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: 18 }}>今日计划</strong>
            <span style={{ color: "#8a837d", fontSize: 12 }}>
              已完成 {payload.home.tasks.filter((task) => task.completed).length}/{payload.home.tasks.length}
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "#eee7df", overflow: "hidden" }}>
            <div
              style={{
                width: `${payload.home.completionRate * 100}%`,
                height: "100%",
                background: "#b7a6ff",
              }}
            />
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {payload.home.tasks.map((task) => (
              <div
                key={task.title}
                style={{
                  borderRadius: 18,
                  border: "1px solid #efe7de",
                  background: task.completed ? "#fbf8f4" : "#ffffff",
                  padding: "12px 16px",
                }}
              >
                <strong style={{ display: "block" }}>{task.title}</strong>
                <span style={{ color: "#8c847d", fontSize: 12 }}>{task.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function TeamScreen({ payload }: { payload: BootstrapPayload }) {
  const [selectedAction, setSelectedAction] = React.useState<"加油" | "提醒" | "庆祝">("提醒");
  const [selectedMember, setSelectedMember] = React.useState<keyof typeof memberDetailMap | null>(null);
  const [isRecipientPickerOpen, setIsRecipientPickerOpen] = React.useState(false);
  const [selectedRecipients, setSelectedRecipients] = React.useState<string[]>([]);
  const [sendFeedback, setSendFeedback] = React.useState("给还没开始的队友发个温和提醒，让大家记得今天的计划。");
  const actionCopy: Record<typeof selectedAction, string> = {
    加油: "给掉队队友发一条轻鼓励，提醒他们今天也值得动一动。",
    提醒: "给还没开始的队友发个温和提醒，让大家记得今天的计划。",
    庆祝: "给已经完成的队友送上庆祝，让小队氛围继续升温。",
  };

  const activeMemberDetail = selectedMember ? memberDetailMap[selectedMember] : null;

  function toggleRecipient(name: string) {
    setSelectedRecipients((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );
  }

  function handleSendAction() {
    if (selectedRecipients.length === 0) {
      return;
    }

    setSendFeedback(`已提醒 ${selectedRecipients.join("、")}，记得看看她们今天的进度。`);
    setIsRecipientPickerOpen(false);
    setSelectedRecipients([]);
  }

  return (
    <section style={{ display: "grid", gap: 18, paddingTop: 24 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 32, lineHeight: "38px" }}>小队任务</h1>
        <p style={{ margin: "10px 0 0", color: "#706a64" }}>{payload.team.campusLabel}</p>
      </div>
      <div style={cardStyle}>
        <p style={{ margin: 0, color: "#8a817b", fontSize: 12 }}>本周目标</p>
        <h2 style={{ margin: "10px 0 16px", fontSize: 22, lineHeight: "30px" }}>
          小队完成率超过 80%，一起解锁发光徽章。
        </h2>
        <div style={{ height: 8, borderRadius: 999, background: "#eee6de", overflow: "hidden" }}>
          <div style={{ width: `${payload.team.weeklyProgress * 100}%`, height: "100%", background: "#b9a7ff" }} />
        </div>
      </div>
      <div style={{ ...cardStyle, display: "grid", gap: 10 }}>
        <strong style={{ fontSize: 18 }}>队员状态</strong>
        {payload.team.members.map((member) => (
          <button
            key={member.display}
            type="button"
            onClick={() => setSelectedMember(member.display as keyof typeof memberDetailMap)}
            style={{
              width: "100%",
              borderRadius: 20,
              border: "1px solid #efe7de",
              background: "#fffefc",
              padding: "12px 16px",
              textAlign: "left",
              cursor: "pointer",
              appearance: "none",
            }}
          >
            <strong style={{ display: "block" }}>{member.display}</strong>
            <span style={{ color: "#8a837d", fontSize: 12 }}>{member.status}</span>
          </button>
        ))}
      </div>
      {activeMemberDetail ? (
        <div style={{ ...cardStyle, display: "grid", gap: 12, background: "#fffefd" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontSize: 22 }}>{selectedMember} 的今日任务</h2>
            <button type="button" style={secondaryButtonStyle} onClick={() => setSelectedMember(null)}>
              关闭
            </button>
          </div>
          <span style={{ color: "#8a837d", fontSize: 12 }}>最近打卡：{activeMemberDetail.lastCheckIn}</span>
          <span style={{ color: "#8a837d", fontSize: 12 }}>今日贡献：{activeMemberDetail.contribution}</span>
          <div style={{ display: "grid", gap: 10 }}>
            {activeMemberDetail.tasks.map((task) => (
              <div
                key={task.title}
                style={{
                  borderRadius: 18,
                  border: "1px solid #efe7de",
                  background: "#ffffff",
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <span>{task.title}</span>
                <span style={{ color: "#8a837d", fontSize: 12 }}>{task.status}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div style={{ ...cardStyle, display: "grid", gap: 12 }}>
        <strong style={{ fontSize: 18 }}>轻社交提醒</strong>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {(["加油", "提醒", "庆祝"] as const).map((action) => {
            const isSelected = selectedAction === action;
            const selectedStyle =
              action === "提醒"
                ? { background: "#f4eeff", color: "#7b69cc", border: "1px solid #d9ccff" }
                : action === "庆祝"
                  ? { background: "#fff6e6", color: "#9a7a2f", border: "1px solid #f2ddab" }
                  : { background: "#eef5ff", color: "#5576a3", border: "1px solid #cbdcf5" };

            return (
              <button
                key={action}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setSelectedAction(action);
                  setSendFeedback(actionCopy[action]);
                }}
                style={{
                  ...secondaryButtonStyle,
                  ...(isSelected ? selectedStyle : {}),
                }}
              >
                {action}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          style={primaryButtonStyle}
          onClick={() => {
            setIsRecipientPickerOpen(true);
            setSendFeedback(actionCopy[selectedAction]);
          }}
        >
          选择成员并发送
        </button>
        <p style={{ margin: 0, color: "#8a837d", fontSize: 12, lineHeight: "18px" }}>
          {sendFeedback}
        </p>
      </div>
      {isRecipientPickerOpen ? (
        <div
          role="dialog"
          aria-label="选择提醒对象"
          style={{ ...cardStyle, display: "grid", gap: 12, background: "#fffcf8" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontSize: 22 }}>选择提醒对象</h2>
            <button type="button" style={secondaryButtonStyle} onClick={() => setIsRecipientPickerOpen(false)}>
              取消
            </button>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {payload.team.members
              .filter((member) => !member.isCurrent)
              .map((member) => {
                const isSelected = selectedRecipients.includes(member.display);

                return (
                  <button
                    key={member.display}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleRecipient(member.display)}
                    style={{
                      width: "100%",
                      borderRadius: 18,
                      border: `1px solid ${isSelected ? "#d9ccff" : "#efe7de"}`,
                      background: isSelected ? "#f4eeff" : "#ffffff",
                      padding: "14px 16px",
                      display: "grid",
                      gap: 6,
                      textAlign: "left",
                      cursor: "pointer",
                      appearance: "none",
                    }}
                  >
                    <strong style={{ display: "block" }}>{member.display}</strong>
                    <span style={{ color: "#8a837d", fontSize: 12 }}>{member.status}</span>
                  </button>
                );
              })}
          </div>
          <button
            type="button"
            style={{
              ...primaryButtonStyle,
              opacity: selectedRecipients.length > 0 ? 1 : 0.45,
              cursor: selectedRecipients.length > 0 ? "pointer" : "not-allowed",
            }}
            disabled={selectedRecipients.length === 0}
            onClick={handleSendAction}
          >
            发送提醒
          </button>
        </div>
      ) : null}
    </section>
  );
}

function ChallengeScreen({ payload }: { payload: BootstrapPayload }) {
  const [selectedChallenge, setSelectedChallenge] = React.useState<keyof typeof challengeDetailMap | null>(null);

  if (selectedChallenge) {
    const detail = challengeDetailMap[selectedChallenge];

    return (
      <section style={{ display: "grid", gap: 18, paddingTop: 24 }}>
        <button type="button" style={secondaryButtonStyle} onClick={() => setSelectedChallenge(null)}>
          返回挑战列表
        </button>
        <div style={cardStyle}>
          <h1 style={{ margin: 0, fontSize: 32, lineHeight: "38px" }}>{selectedChallenge}</h1>
          <p style={{ margin: "14px 0 0", color: "#6f6862", lineHeight: "24px" }}>{detail.rule}</p>
        </div>
        <div style={{ ...cardStyle, display: "grid", gap: 12 }}>
          <strong style={{ fontSize: 18 }}>活动规则</strong>
          <p style={{ margin: 0, color: "#6f6862", lineHeight: "22px" }}>{detail.rule}</p>
          <strong style={{ fontSize: 18 }}>排名依据</strong>
          <p style={{ margin: 0, color: "#6f6862", lineHeight: "22px" }}>{detail.ranking}</p>
          <strong style={{ fontSize: 18 }}>奖励说明</strong>
          <p style={{ margin: 0, color: "#6f6862", lineHeight: "22px" }}>{detail.reward}</p>
          <strong style={{ fontSize: 18 }}>当前进度</strong>
          <p style={{ margin: 0, color: "#6f6862", lineHeight: "22px" }}>{detail.progress}</p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ display: "grid", gap: 18, paddingTop: 24 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 32, lineHeight: "38px" }}>校园挑战</h1>
        <p style={{ margin: "10px 0 0", color: "#706a64" }}>用轻竞技让每周运动更有参与感。</p>
      </div>
      <div style={cardStyle}>
        <p style={{ margin: 0, color: "#8a817b", fontSize: 12 }}>本周主题赛</p>
        <h2 style={{ margin: "10px 0 10px", fontSize: 28, lineHeight: "34px" }}>
          {payload.challenge.heroTitle}
        </h2>
        <p style={{ margin: 0, color: "#6f6862", lineHeight: "20px" }}>{payload.challenge.heroDescription}</p>
        <div style={{ marginTop: 16 }}>
          <span style={{ ...secondaryButtonStyle, background: "#ffffff", color: "#9a7a2f" }}>
            {payload.challenge.remaining}
          </span>
        </div>
      </div>
      <div style={{ ...cardStyle, display: "grid", gap: 12 }}>
        <strong style={{ fontSize: 18 }}>活动入口</strong>
        {payload.challenge.items.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setSelectedChallenge(item.title as keyof typeof challengeDetailMap)}
            style={{
              width: "100%",
              borderRadius: 24,
              border: "1px solid #efe7de",
              background: "#fffefc",
              padding: "16px 18px",
              textAlign: "left",
              cursor: "pointer",
              appearance: "none",
            }}
          >
            <strong style={{ display: "block" }}>{item.title}</strong>
            <span style={{ color: "#807872", fontSize: 12 }}>{item.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function AchievementScreen({ payload }: { payload: BootstrapPayload }) {
  const [selectedBadge, setSelectedBadge] = React.useState<keyof typeof badgeDetailMap | null>(null);
  const [showLockedBadges, setShowLockedBadges] = React.useState(false);

  if (selectedBadge) {
    const detail = badgeDetailMap[selectedBadge];

    return (
      <section style={{ display: "grid", gap: 18, paddingTop: 24 }}>
        <button type="button" style={secondaryButtonStyle} onClick={() => setSelectedBadge(null)}>
          返回徽章列表
        </button>
        <div style={cardStyle}>
          <h1 style={{ margin: 0, fontSize: 32, lineHeight: "38px" }}>{selectedBadge}</h1>
          <p style={{ margin: "14px 0 0", color: "#6f6862", lineHeight: "24px" }}>{detail.description}</p>
        </div>
        <div style={{ ...cardStyle, display: "grid", gap: 12 }}>
          <p style={{ margin: 0, color: "#6f6862", lineHeight: "22px" }}>{detail.condition}</p>
          <p style={{ margin: 0, color: "#6f6862", lineHeight: "22px" }}>{detail.reason}</p>
          <p style={{ margin: 0, color: "#6f6862", lineHeight: "22px" }}>{detail.earnedAt}</p>
          <p style={{ margin: 0, color: "#6f6862", lineHeight: "22px" }}>{detail.description}</p>
        </div>
      </section>
    );
  }

  if (showLockedBadges) {
    return (
      <section style={{ display: "grid", gap: 18, paddingTop: 24 }}>
        <button type="button" style={secondaryButtonStyle} onClick={() => setShowLockedBadges(false)}>
          返回成就系统
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 32, lineHeight: "38px" }}>未获得勋章</h1>
          <p style={{ margin: "10px 0 0", color: "#706a64" }}>提前看看下一枚勋章还差什么，给坚持多一点方向感。</p>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {payload.achievements.lockedBadges.map((badge) => (
            <div key={badge.title} style={{ ...cardStyle, display: "grid", gap: 10 }}>
              <strong style={{ fontSize: 20 }}>{badge.title}</strong>
              <span style={{ color: "#6f6862", lineHeight: "22px" }}>{badge.condition}</span>
              <span style={{ color: "#8a837d", fontSize: 13 }}>{badge.progress}</span>
              <span style={{ color: "#7b69cc", fontWeight: 600 }}>{badge.reward}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section style={{ display: "grid", gap: 18, paddingTop: 24 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 32, lineHeight: "38px" }}>成就系统</h1>
        <p style={{ margin: "10px 0 0", color: "#706a64" }}>每一次坚持，都在塑造更自律的你。</p>
      </div>
      <div style={cardStyle}>
        <p style={{ margin: 0, color: "#8a817b", fontSize: 12 }}>等级 06</p>
        <h2 style={{ margin: "10px 0 14px", fontSize: 28 }}>{payload.achievements.levelTitle}</h2>
        <div style={{ height: 8, borderRadius: 999, background: "#eee6de", overflow: "hidden" }}>
          <div
            style={{
              width: `${(payload.user.currentXp / payload.user.nextLevelXp) * 100}%`,
              height: "100%",
              background: "#b9a7ff",
            }}
          />
        </div>
        <p style={{ margin: "10px 0 0", color: "#8a837d", fontSize: 12 }}>
          距离 7 级还差 {payload.user.nextLevelXp - payload.user.currentXp} XP
        </p>
      </div>
      <div style={{ ...cardStyle, display: "grid", gap: 12 }}>
        <strong style={{ fontSize: 18 }}>最近徽章</strong>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {payload.achievements.badges.map((badge) => (
            <button
              key={badge.title}
              type="button"
              onClick={() => setSelectedBadge(badge.title as keyof typeof badgeDetailMap)}
              style={{
                appearance: "none",
                textAlign: "left",
                cursor: "pointer",
                borderRadius: 22,
                border: "1px solid #efe7de",
                background: "#fffefc",
                padding: 18,
              }}
            >
              <strong>{badge.title}</strong>
            </button>
          ))}
        </div>
        <button type="button" style={secondaryButtonStyle} onClick={() => setShowLockedBadges(true)}>
          查看未获得勋章
        </button>
      </div>
      <div style={{ ...cardStyle, display: "grid", gap: 12 }}>
        <strong style={{ fontSize: 18 }}>里程碑</strong>
        {payload.achievements.milestones.map((milestone) => (
          <div key={milestone.title} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span>{milestone.title}</span>
            <span style={{ color: "#8a837d", fontSize: 12 }}>{milestone.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function StoreScreen({
  payload,
  ownedItems,
  onPurchase,
}: {
  payload: BootstrapPayload;
  ownedItems: string[];
  onPurchase: (itemTitle: string, price: number) => void;
}) {
  return (
    <section style={{ display: "grid", gap: 18, paddingTop: 24 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 32, lineHeight: "38px" }}>Quest 商城</h1>
        <p style={{ margin: "10px 0 0", color: "#706a64" }}>把坚持换成小奖励，让每次进步都有看得见的收获。</p>
      </div>
      <div style={cardStyle}>
        <p style={{ margin: 0, color: "#8a817b", fontSize: 12 }}>当前余额</p>
        <h2 style={{ margin: "10px 0 0", fontSize: 28 }}>{`当前余额 ${payload.user.coins} Quest Coins`}</h2>
      </div>
      <div style={{ ...cardStyle, display: "grid", gap: 12 }}>
        <strong style={{ fontSize: 18 }}>获取方式</strong>
        <div style={{ display: "grid", gap: 8, color: "#6f6862", lineHeight: "22px" }}>
          <span>打卡完成：+12 Quest Coins</span>
          <span>获得勋章：+30 Quest Coins</span>
          <span>挑战赛获奖：+80 Quest Coins</span>
        </div>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {storeCatalog.map((item) => {
          const isOwned = ownedItems.includes(item.title);
          const canAfford = payload.user.coins >= item.price;

          return (
            <div key={item.title} style={{ ...cardStyle, display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <strong style={{ fontSize: 20 }}>{item.title}</strong>
                <span style={{ color: "#6f6862", lineHeight: "22px" }}>{item.description}</span>
                <span style={{ color: "#8a837d", fontSize: 12 }}>{item.price} Quest Coins</span>
              </div>
              <button
                type="button"
                style={{
                  ...primaryButtonStyle,
                  opacity: isOwned || canAfford ? 1 : 0.45,
                  cursor: isOwned ? "default" : canAfford ? "pointer" : "not-allowed",
                }}
                disabled={isOwned || !canAfford}
                onClick={() => onPurchase(item.title, item.price)}
              >
                {isOwned ? `已拥有 ${item.title}` : `购买 ${item.title}`}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SuccessScreen({
  payload,
  onBack,
}: {
  payload: BootstrapPayload;
  onBack: () => void;
}) {
  return (
    <section style={{ display: "grid", gap: 24, paddingTop: 120 }}>
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: "50%",
          margin: "0 auto",
          background: "rgba(185,167,255,0.2)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "#b9a7ff",
          }}
        />
      </div>
      <div style={{ display: "grid", gap: 12, textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: 34, lineHeight: "40px" }}>打卡完成</h1>
        <p style={{ margin: 0, color: "#6f6862", lineHeight: "24px" }}>
          你完成了今天的运动，小队连胜继续保持。
        </p>
      </div>
      <div style={{ ...cardStyle, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>经验值</span>
          <strong>+18 XP</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>小队贡献</span>
          <strong>+12 活跃值</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Quest Coins</span>
          <strong>+12 Quest Coins</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>累计运动</span>
          <strong>{payload.user.totalWorkouts} 次</strong>
        </div>
      </div>
      <button type="button" style={primaryButtonStyle} onClick={onBack}>
        返回首页
      </button>
    </section>
  );
}

export function MoveQuestApp({
  initialData,
  onCheckIn,
  bootstrapPath = null,
  checkInPath = null,
}: MoveQuestAppProps) {
  const [payload, setPayload] = React.useState(initialData);
  const [stage, setStage] = React.useState<AppStage>("onboarding-1");
  const [activeTab, setActiveTab] = React.useState<AppTab>("home");
  const [selectedGoal, setSelectedGoal] = React.useState<GoalKey | null>(null);
  const [ownedItems, setOwnedItems] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!bootstrapPath) {
      return;
    }

    const resolvedBootstrapPath = toAbsolutePath(bootstrapPath);
    let cancelled = false;

    async function refreshPayload() {
      try {
        const response = await fetch(resolvedBootstrapPath, { cache: "no-store" });
        const nextPayload = (await response.json()) as BootstrapPayload;

        if (!cancelled) {
          setPayload(nextPayload);
        }
      } catch {
        // Tests and offline rendering can fall back to the provided initial payload.
      }
    }

    void refreshPayload();

    return () => {
      cancelled = true;
    };
  }, [bootstrapPath]);

  const displayPayload = React.useMemo(
    () => (selectedGoal ? applyGoalTaskPack(payload, selectedGoal) : payload),
    [payload, selectedGoal],
  );

  const handleCheckIn = React.useCallback(async (taskTitle: string) => {
    const targetTask = getTaskByTitle(displayPayload, taskTitle) ?? getOpenTask(displayPayload);
    if (!targetTask) {
      return;
    }

    let nextPayload = payload;
    const serverTaskTitle = targetTask.serverTaskTitle ?? targetTask.title;

    if (onCheckIn) {
      nextPayload = await onCheckIn(serverTaskTitle);
    } else if (checkInPath) {
      const response = await fetch(toAbsolutePath(checkInPath), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskTitle: serverTaskTitle }),
      });
      nextPayload = (await response.json()) as BootstrapPayload;
    }

    setPayload(nextPayload);
    setStage("success");
  }, [checkInPath, displayPayload, onCheckIn, payload]);

  const renderContent = () => {
    switch (stage) {
      case "onboarding-1":
        return (
          <section style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h1 style={{ margin: 0, fontSize: 26 }}>MoveQuest</h1>
              <button
                type="button"
                style={{ ...secondaryButtonStyle, padding: "10px 14px" }}
                onClick={() => setStage("app")}
              >
                跳过引导，直接进入应用
              </button>
            </div>
            <OnboardingStep
              title="不是你不想动，只是很难一直坚持。"
              description="把运动从单人苦撑，变成和朋友一起完成的日常闯关。"
              buttonLabel="开始体验"
              onNext={() => setStage("onboarding-2")}
            />
          </section>
        );
      case "onboarding-2":
        return (
          <OnboardingStep
            title="社交监督 + 成就反馈，让坚持更轻松。"
            description="有人和你组队、有人给你提醒、每次完成都能看见成长。"
            buttonLabel="继续"
            onNext={() => setStage("goal")}
          />
        );
      case "goal":
        return (
          <GoalSelect
            selectedGoal={selectedGoal ?? "规律生活"}
            onSelect={setSelectedGoal}
            onNext={() => setStage("team-setup")}
          />
        );
      case "team-setup":
        return <TeamSetup payload={displayPayload} onNext={() => setStage("app")} />;
      case "success":
        return <SuccessScreen payload={displayPayload} onBack={() => setStage("app")} />;
      case "app":
      default:
        if (activeTab === "team") {
          return <TeamScreen payload={displayPayload} />;
        }

        if (activeTab === "challenge") {
          return <ChallengeScreen payload={displayPayload} />;
        }

        if (activeTab === "store") {
          return (
            <StoreScreen
              payload={displayPayload}
              ownedItems={ownedItems}
              onPurchase={(itemTitle, price) => {
                setPayload((current) => ({
                  ...current,
                  user: {
                    ...current.user,
                    coins: current.user.coins - price,
                  },
                }));
                setOwnedItems((current) => [...current, itemTitle]);
              }}
            />
          );
        }

        if (activeTab === "me") {
          return <AchievementScreen payload={displayPayload} />;
        }

        return <HomeScreen payload={displayPayload} selectedGoal={selectedGoal} onCheckIn={handleCheckIn} />;
    }
  };

  return (
    <main style={shellStyle}>
      <div style={phoneStyle}>
        {renderContent()}
        {stage === "app" ? <BottomNav activeTab={activeTab} onChange={setActiveTab} /> : null}
      </div>
    </main>
  );
}
