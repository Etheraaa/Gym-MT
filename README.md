# MoveQuest MVP

基于 PRD 和 Figma 主链路实现的全栈 MVP，覆盖：

- 引导页与目标选择
- 小队创建与首页任务流
- 打卡成功反馈
- 小队页、挑战页、成就页
- 本地 SQLite 数据持久化
- Bootstrap / Check-in API

## Tech Stack

- Next.js
- React
- TypeScript
- SQLite via `better-sqlite3`
- Vitest + Testing Library

## Local Run

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## Data

- 本地数据库文件位于 `data/movequest.db`
- 页面首次加载会请求 `/api/bootstrap`
- 首页“立即开始”会请求 `/api/check-in`

## Test

```bash
npm test
```

## Build

```bash
npm run build
```
