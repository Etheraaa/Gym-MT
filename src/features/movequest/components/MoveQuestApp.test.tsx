import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MoveQuestApp } from "./MoveQuestApp";
import { mockBootstrap } from "../mock-flow";

describe("MoveQuestApp", () => {
  it("progresses from onboarding into the main home screen", async () => {
    const user = userEvent.setup();

    render(<MoveQuestApp initialData={mockBootstrap} />);

    await user.click(screen.getByRole("button", { name: "开始体验" }));
    await user.click(screen.getByRole("button", { name: "继续" }));
    await user.click(screen.getByRole("button", { name: "继续并创建小队" }));
    await user.click(screen.getByRole("button", { name: "进入今日首页" }));

    expect(screen.getByRole("heading", { name: "星期四" })).toBeInTheDocument();
    expect(screen.getByText("和你的队友一起把运动变成习惯。")).toBeInTheDocument();
  });

  it("switches between bottom navigation tabs", async () => {
    const user = userEvent.setup();

    render(<MoveQuestApp initialData={mockBootstrap} />);

    await user.click(screen.getByRole("button", { name: "跳过引导，直接进入应用" }));
    await user.click(screen.getByRole("button", { name: "小队" }));
    expect(screen.getByRole("heading", { name: "小队任务" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "挑战" }));
    expect(screen.getByRole("heading", { name: "校园挑战" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "我的" }));
    expect(screen.getByRole("heading", { name: "成就系统" })).toBeInTheDocument();
  });

  it("shows check-in success feedback after completing the open task", async () => {
    const user = userEvent.setup();
    const planningPayload = {
      ...mockBootstrap,
      user: {
        ...mockBootstrap.user,
        coins: 168,
      },
      home: {
        ...mockBootstrap.home,
        completionRate: 0,
        tasks: [
          { title: "晨跑", duration: "20 分钟", completed: false, completionHint: "连续慢跑 20 分钟后返回打卡" },
          { title: "喝水 + 拉伸", duration: "10 分钟", completed: false, completionHint: "完成补水并拉伸 10 分钟后打卡" },
          { title: "夜间散步", duration: "30 分钟", completed: false, completionHint: "累计步行 30 分钟并返回打卡" },
        ],
      },
    } as unknown as typeof mockBootstrap;
    const onCheckIn = vi.fn(async () => ({
      ...planningPayload,
      home: {
        ...planningPayload.home,
        tasks: planningPayload.home.tasks.map((task) => ({
          ...task,
          completed: task.title === "夜间散步" ? true : task.completed,
        })),
      },
      user: {
        ...planningPayload.user,
        totalWorkouts: planningPayload.user.totalWorkouts + 1,
        coins: planningPayload.user.coins + 12,
      },
    }));

    render(<MoveQuestApp initialData={planningPayload} onCheckIn={onCheckIn} />);

    await user.click(screen.getByRole("button", { name: "跳过引导，直接进入应用" }));
    await user.click(screen.getByRole("button", { name: "立即开始" }));

    expect(screen.getByText("选择今天想完成的任务")).toBeInTheDocument();
    expect(onCheckIn).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /夜间散步/ }));
    expect(screen.getByText("累计步行 30 分钟并返回打卡")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "开始这个任务" }));
    expect(screen.getAllByText("正在进行：夜间散步")).toHaveLength(2);
    expect(onCheckIn).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "标记已完成" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "打卡完成" })).toBeInTheDocument();
    });

    expect(onCheckIn).toHaveBeenCalledWith("夜间散步");
    expect(screen.getByText("+12 Quest Coins")).toBeInTheDocument();
  });

  it("lets the user select different workout goals on the goal screen", async () => {
    const user = userEvent.setup();

    render(<MoveQuestApp initialData={mockBootstrap} />);

    await user.click(screen.getByRole("button", { name: "开始体验" }));
    await user.click(screen.getByRole("button", { name: "继续" }));

    const routineGoal = screen.getByRole("button", { name: "规律生活 建立每天动一动的稳定节奏" });
    const stressGoal = screen.getByRole("button", { name: "减压放松 用散步和轻运动缓解学习压力" });
    const fitnessGoal = screen.getByRole("button", { name: "提升体能 从基础耐力开始慢慢进步" });
    const shapingGoal = screen.getByRole("button", { name: "塑形管理 把轻健身和打卡结合起来" });

    expect(routineGoal).toHaveAttribute("aria-pressed", "true");
    expect(stressGoal).toHaveAttribute("aria-pressed", "false");

    await user.click(stressGoal);
    expect(stressGoal).toHaveAttribute("aria-pressed", "true");
    expect(routineGoal).toHaveAttribute("aria-pressed", "false");

    await user.click(fitnessGoal);
    expect(fitnessGoal).toHaveAttribute("aria-pressed", "true");
    expect(stressGoal).toHaveAttribute("aria-pressed", "false");

    await user.click(shapingGoal);
    expect(shapingGoal).toHaveAttribute("aria-pressed", "true");
    expect(fitnessGoal).toHaveAttribute("aria-pressed", "false");
  });

  it("lets the user send lightweight social feedback from the team screen", async () => {
    const user = userEvent.setup();

    render(<MoveQuestApp initialData={mockBootstrap} />);

    await user.click(screen.getByRole("button", { name: "跳过引导，直接进入应用" }));
    await user.click(screen.getByRole("button", { name: "小队" }));

    const cheerButton = screen.getByRole("button", { name: "加油" });
    const remindButton = screen.getByRole("button", { name: "提醒" });
    const celebrateButton = screen.getByRole("button", { name: "庆祝" });

    expect(remindButton).toHaveAttribute("aria-pressed", "true");

    await user.click(cheerButton);
    expect(cheerButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("给掉队队友发一条轻鼓励，提醒他们今天也值得动一动。")).toBeInTheDocument();

    await user.click(celebrateButton);
    expect(celebrateButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("给已经完成的队友送上庆祝，让小队氛围继续升温。")).toBeInTheDocument();
  });

  it("shows a different task pack after choosing a different goal", async () => {
    const user = userEvent.setup();

    render(<MoveQuestApp initialData={mockBootstrap} />);

    await user.click(screen.getByRole("button", { name: "开始体验" }));
    await user.click(screen.getByRole("button", { name: "继续" }));
    await user.click(screen.getByRole("button", { name: "减压放松 用散步和轻运动缓解学习压力" }));
    await user.click(screen.getByRole("button", { name: "继续并创建小队" }));
    await user.click(screen.getByRole("button", { name: "进入今日首页" }));

    expect(screen.getByText("睡前散步")).toBeInTheDocument();
    expect(screen.getByText("呼吸放松")).toBeInTheDocument();
    expect(screen.queryByText("晨跑")).not.toBeInTheDocument();
  });

  it("opens a member detail view from the team screen", async () => {
    const user = userEvent.setup();

    render(<MoveQuestApp initialData={mockBootstrap} />);

    await user.click(screen.getByRole("button", { name: "跳过引导，直接进入应用" }));
    await user.click(screen.getByRole("button", { name: "小队" }));
    await user.click(screen.getByRole("button", { name: "Lena 还差 1 项" }));

    expect(screen.getByRole("heading", { name: "Lena 的今日任务" })).toBeInTheDocument();
    expect(screen.getByText("最近打卡：今天 18:20")).toBeInTheDocument();
    expect(screen.getByText("今日贡献：8 活跃值")).toBeInTheDocument();
  });

  it("lets the user choose multiple reminder recipients before sending", async () => {
    const user = userEvent.setup();

    render(<MoveQuestApp initialData={mockBootstrap} />);

    await user.click(screen.getByRole("button", { name: "跳过引导，直接进入应用" }));
    await user.click(screen.getByRole("button", { name: "小队" }));
    await user.click(screen.getByRole("button", { name: "选择成员并发送" }));

    expect(screen.getByRole("heading", { name: "选择提醒对象" })).toBeInTheDocument();
    const recipientDialog = screen.getByRole("dialog", { name: "选择提醒对象" });

    await user.click(within(recipientDialog).getByRole("button", { name: "Ava 今天已完成" }));
    await user.click(within(recipientDialog).getByRole("button", { name: "Lena 还差 1 项" }));
    await user.click(screen.getByRole("button", { name: "发送提醒" }));

    expect(screen.getByText("已提醒 Ava、Lena，记得看看她们今天的进度。")).toBeInTheDocument();
  });

  it("opens a challenge detail view from the challenge tab", async () => {
    const user = userEvent.setup();

    render(<MoveQuestApp initialData={mockBootstrap} />);

    await user.click(screen.getByRole("button", { name: "跳过引导，直接进入应用" }));
    await user.click(screen.getByRole("button", { name: "挑战" }));
    await user.click(screen.getByRole("button", { name: "宿舍冲榜赛 按宿舍统计本周完成率" }));

    expect(screen.getByRole("heading", { name: "宿舍冲榜赛" })).toBeInTheDocument();
    expect(screen.getAllByText("按宿舍一周内平均完成率进行排名，每晚 10 点刷新。")).toHaveLength(2);
    expect(screen.getByText("奖励：周冠军宿舍解锁发光徽章和分享海报")).toBeInTheDocument();
  });

  it("opens a badge detail view from the achievement tab", async () => {
    const user = userEvent.setup();

    render(<MoveQuestApp initialData={mockBootstrap} />);

    await user.click(screen.getByRole("button", { name: "跳过引导，直接进入应用" }));
    await user.click(screen.getByRole("button", { name: "我的" }));
    await user.click(screen.getByRole("button", { name: "7 天连胜" }));

    expect(screen.getByRole("heading", { name: "7 天连胜" })).toBeInTheDocument();
    expect(screen.getByText("获得条件：连续 7 天完成至少 1 项运动任务")).toBeInTheDocument();
    expect(screen.getByText("获得说明：你已经连续一周保持打卡，没有让自己的节奏掉线。")).toBeInTheDocument();
  });

  it("lets the user purchase an item from the store with quest coins", async () => {
    const user = userEvent.setup();

    render(<MoveQuestApp initialData={mockBootstrap} />);

    await user.click(screen.getByRole("button", { name: "跳过引导，直接进入应用" }));
    await user.click(screen.getByRole("button", { name: "商城" }));

    expect(screen.getByRole("heading", { name: "Quest 商城" })).toBeInTheDocument();
    expect(screen.getByText("当前余额 168 Quest Coins")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "购买 打卡烟花特效" }));

    expect(screen.getByText("当前余额 108 Quest Coins")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "已拥有 打卡烟花特效" })).toBeInTheDocument();
  });

  it("shows a page for locked badges from the achievement tab", async () => {
    const user = userEvent.setup();

    render(<MoveQuestApp initialData={mockBootstrap} />);

    await user.click(screen.getByRole("button", { name: "跳过引导，直接进入应用" }));
    await user.click(screen.getByRole("button", { name: "我的" }));
    await user.click(screen.getByRole("button", { name: "查看未获得勋章" }));

    expect(screen.getByRole("heading", { name: "未获得勋章" })).toBeInTheDocument();
    expect(screen.getByText("14 天连胜")).toBeInTheDocument();
    expect(screen.getByText("解锁条件：连续 14 天完成至少 1 项运动任务")).toBeInTheDocument();
    expect(screen.getByText("奖励：+30 Quest Coins")).toBeInTheDocument();
  });
});
