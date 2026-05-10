# MoveQuest MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable full-stack MoveQuest MVP from the approved PRD and Figma flow, covering onboarding, home, team, challenge, achievements, profile, and share-card experiences.

**Architecture:** Use a single Next.js application for both frontend and backend. Persist seeded MVP data in SQLite via Prisma, expose read/update flows through route handlers, and render a mobile-first UI that matches the Figma screens while remaining data-driven.

**Tech Stack:** Next.js, React, TypeScript, Prisma, SQLite, Vitest, Testing Library

---

### Task 1: Scaffold the app and test foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`

- [ ] Write a basic failing UI smoke test for the app shell
- [ ] Run the smoke test and confirm it fails because the shell does not exist yet
- [ ] Add the minimal Next.js app shell and Vitest setup
- [ ] Re-run the smoke test and confirm it passes

### Task 2: Model the MVP data

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `src/server/db.ts`
- Create: `src/server/repositories/movequest-repository.ts`
- Create: `src/server/repositories/movequest-repository.test.ts`

- [ ] Write failing repository tests for loading seeded dashboard, team, challenge, achievement, and profile data
- [ ] Run the repository tests and confirm they fail for the expected missing schema/repository reasons
- [ ] Add the Prisma schema, seed script, db client, and minimal repository implementation
- [ ] Re-run the repository tests and confirm they pass

### Task 3: Expose backend routes

**Files:**
- Create: `src/app/api/bootstrap/route.ts`
- Create: `src/app/api/check-in/route.ts`
- Create: `src/app/api/bootstrap/route.test.ts`
- Create: `src/app/api/check-in/route.test.ts`
- Modify: `src/server/repositories/movequest-repository.ts`

- [ ] Write failing route tests for bootstrap payload loading and check-in task completion
- [ ] Run the route tests and confirm they fail correctly
- [ ] Implement minimal route handlers and repository updates
- [ ] Re-run the route tests and confirm they pass

### Task 4: Build the mobile frontend flow

**Files:**
- Create: `src/features/movequest/types.ts`
- Create: `src/features/movequest/mock-flow.ts`
- Create: `src/features/movequest/use-bootstrap.ts`
- Create: `src/features/movequest/components/*.tsx`
- Create: `src/features/movequest/components/*.test.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [ ] Write failing component tests for onboarding progression, tab switching, and check-in success feedback
- [ ] Run the component tests and confirm they fail correctly
- [ ] Implement the mobile-first UI using shared screen components and real bootstrap/check-in data
- [ ] Re-run the component tests and confirm they pass

### Task 5: Verify and polish

**Files:**
- Modify: `README.md`

- [ ] Run the full test suite
- [ ] Run a production build
- [ ] Add concise local run instructions and data notes to `README.md`
- [ ] Re-run tests if any verification fixes were required
