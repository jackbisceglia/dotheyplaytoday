/// <reference types="@cloudflare/workers-types" />

type NotifyWorkerEnv = {
  readonly Database: D1Database;
};

export default {
  async scheduled(controller, env) {
    const startedAt = new Date();
    const completedAt = new Date();

    await env.Database.prepare(
      `INSERT INTO worker_runs (
        id,
        kind,
        cron,
        scheduled_time,
        started_at,
        completed_at,
        status,
        metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        crypto.randomUUID(),
        "notify",
        controller.cron,
        new Date(controller.scheduledTime).toISOString(),
        startedAt.toISOString(),
        completedAt.toISOString(),
        "dry_run",
        JSON.stringify({
          message: "Cloudflare D1 + scheduled Worker smoke run.",
        }),
      )
      .run();
  },
} satisfies ExportedHandler<NotifyWorkerEnv>;
