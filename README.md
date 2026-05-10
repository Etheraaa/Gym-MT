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
- 可通过环境变量 `MOVEQUEST_DB_PATH` 覆盖数据库文件路径，例如部署到 Railway 时可设置为 `/data/movequest.db`

## Deploy Notes

推荐使用支持持久化磁盘的部署平台，例如 Railway。

部署时建议配置：

```bash
MOVEQUEST_DB_PATH=/data/movequest.db
NODE_ENV=production
```

如果平台支持 Volume / Persistent Disk，请把它挂载到 `/data`，这样 SQLite 数据在服务重启后仍然会保留。

## Test

```bash
npm test
```

## Build

```bash
npm run build
```
