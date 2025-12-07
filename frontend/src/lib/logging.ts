type LogLevel = "info" | "warn" | "error";

type LogMeta = Record<string, unknown>;

function emit(level: LogLevel, message: string, meta?: LogMeta) {
  const payload = {
    level,
    message,
    ...meta,
    timestamp: new Date().toISOString(),
  };
  console[level](JSON.stringify(payload));
}

export function logInfo(message: string, meta?: LogMeta) {
  emit("info", message, meta);
}

export function logWarn(message: string, meta?: LogMeta) {
  emit("warn", message, meta);
}

export function logError(message: string, meta?: LogMeta) {
  emit("error", message, meta);
}
