import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

let database: Database.Database | null = null;

export function resolveDbFilePath(
  env: NodeJS.ProcessEnv = process.env,
  cwd: string = process.cwd(),
) {
  const configuredPath = env.MOVEQUEST_DB_PATH?.trim();

  if (!configuredPath) {
    return path.join(cwd, "data", "movequest.db");
  }

  return path.isAbsolute(configuredPath) ? configuredPath : path.resolve(cwd, configuredPath);
}

function hasColumn(db: Database.Database, tableName: string, columnName: string) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  return columns.some((column) => column.name === columnName);
}

function ensureTaskColumns(db: Database.Database) {
  if (!hasColumn(db, "tasks", "completion_hint")) {
    db.exec(`ALTER TABLE tasks ADD COLUMN completion_hint TEXT NOT NULL DEFAULT ''`);
  }
}

function ensureUserColumns(db: Database.Database) {
  if (!hasColumn(db, "users", "coins")) {
    db.exec(`ALTER TABLE users ADD COLUMN coins INTEGER NOT NULL DEFAULT 0`);
  }
}

function createSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      persona_label TEXT NOT NULL,
      level INTEGER NOT NULL,
      current_xp INTEGER NOT NULL,
      next_level_xp INTEGER NOT NULL,
      streak_days INTEGER NOT NULL,
      total_workouts INTEGER NOT NULL,
      total_wins INTEGER NOT NULL,
      total_distance INTEGER NOT NULL,
      coins INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      campus_label TEXT NOT NULL,
      completion_rate INTEGER NOT NULL,
      weekly_goal TEXT NOT NULL,
      weekly_progress REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      team_id TEXT NOT NULL,
      user_id TEXT,
      display_name TEXT NOT NULL,
      status_label TEXT NOT NULL,
      accent TEXT NOT NULL,
      is_current INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL UNIQUE,
      duration TEXT NOT NULL,
      completion_hint TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      display_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS challenges (
      id TEXT PRIMARY KEY,
      team_id TEXT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      accent TEXT NOT NULL,
      remaining TEXT
    );

    CREATE TABLE IF NOT EXISTS badges (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      accent TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS milestones (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL
    );
  `);

  ensureUserColumns(db);
  ensureTaskColumns(db);
}

export function getDb() {
  if (!database) {
    const dbPath = resolveDbFilePath();
    const dataDir = path.dirname(dbPath);

    fs.mkdirSync(dataDir, { recursive: true });
    database = new Database(dbPath);
    database.pragma("journal_mode = WAL");
    createSchema(database);
  }

  return database;
}
