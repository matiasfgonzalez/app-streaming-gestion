/** Logger mínimo (sin dependencias). Sentry/Pino = backlog de observabilidad. */
type Level = "info" | "warn" | "error";

function log(level: Level, msg: string, meta?: unknown) {
  const line = `[${new Date().toISOString()}] ${level.toUpperCase()} ${msg}`;
  if (level === "error") console.error(line, meta ?? "");
  else if (level === "warn") console.warn(line, meta ?? "");
  else console.log(line, meta ?? "");
}

export const logger = {
  info: (msg: string, meta?: unknown) => log("info", msg, meta),
  warn: (msg: string, meta?: unknown) => log("warn", msg, meta),
  error: (msg: string, meta?: unknown) => log("error", msg, meta),
};
