# Domain Docs

How engineering skills should consume this repo's domain documentation.

## Layout

This repo is configured as a `single-context` repo.

- Read `CONTEXT.md` at the repo root when it exists
- Read ADRs under `docs/adr/` when they exist

If these files do not exist yet, proceed silently and continue the task.

## Consumer rules

- Use the vocabulary defined in `CONTEXT.md` when naming concepts, issues, refactors, or tests
- Check `docs/adr/` for decisions that affect the area you are touching
- If a proposed change conflicts with an ADR, call out the conflict explicitly instead of silently overriding it

## Expected structure

```text
/
├── AGENTS.md
├── CONTEXT.md
├── docs/
│   ├── adr/
│   └── agents/
└── src/
```
