# MoveQuest Interaction Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the home flow feel credible by requiring task selection before completion, and make the team social actions actually interactive.

**Architecture:** Keep the changes localized to the existing MoveQuest UI by adding a small home-task state machine and a lightweight team feedback state. Extend bootstrap task data with completion guidance so the frontend can explain how each task is considered done without inventing copy at render time.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Testing Library, SQLite (`better-sqlite3`)

---

### Task 1: Add UI tests for the new home flow and team actions

**Files:**
- Modify: `/Users/etheraaa/Documents/New project 2/src/features/movequest/components/MoveQuestApp.test.tsx`

- [ ] Write failing tests for:
  - clicking `立即开始` opens a task selection step instead of completing immediately
  - selecting a task reveals its completion rule and requires a second confirmation before check-in
  - clicking `加油 / 提醒 / 庆祝` changes the selected action and updates feedback copy

### Task 2: Implement the frontend interaction states

**Files:**
- Modify: `/Users/etheraaa/Documents/New project 2/src/features/movequest/components/MoveQuestApp.tsx`
- Modify: `/Users/etheraaa/Documents/New project 2/src/features/movequest/types.ts`

- [ ] Add local state for `homeIdle -> taskPicking -> taskReady` and social action selection
- [ ] Render tasks as selectable buttons with completion guidance
- [ ] Change the CTA flow to `立即开始 -> 开始这个任务 -> 标记已完成`
- [ ] Render interactive social action chips with active state and feedback text

### Task 3: Update bootstrap task data so the UI has realistic guidance

**Files:**
- Modify: `/Users/etheraaa/Documents/New project 2/src/features/movequest/mock-flow.ts`
- Modify: `/Users/etheraaa/Documents/New project 2/src/server/repositories/movequest-repository.ts`
- Modify: `/Users/etheraaa/Documents/New project 2/src/server/seed/movequest-seed.ts`

- [ ] Add a `completionHint` field to task payloads
- [ ] Seed more believable initial task progress so the home CTA is consistent with the narrative

### Task 4: Run regression verification

**Files:**
- No code changes expected

- [ ] Run targeted component tests
- [ ] Run the full test suite
- [ ] Run production build verification
