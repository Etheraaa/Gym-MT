# MoveQuest Detail Interactions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add interactive member details, reminder recipient selection, challenge details, and badge details without expanding the backend schema.

**Architecture:** Keep all four interactions inside the existing `MoveQuestApp` surface using local detail state and modal overlays. Use mock-driven detail maps keyed by existing member, challenge, and badge names so the new UI feels richer while staying compatible with the current API payload shape.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Testing Library

---
