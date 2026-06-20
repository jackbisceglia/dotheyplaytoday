CREATE TABLE IF NOT EXISTS worker_runs (
  id TEXT PRIMARY KEY NOT NULL,
  kind TEXT NOT NULL,
  cron TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  status TEXT NOT NULL,
  metadata TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS worker_runs_started_at_idx
ON worker_runs (started_at);
