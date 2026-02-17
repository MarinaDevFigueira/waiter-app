const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  SILENT: 4,
} as const;

type LogLevelValue = (typeof LogLevel)[keyof typeof LogLevel];

const LogLevelNames: Record<number, string> = {
  [LogLevel.DEBUG]: "DEBUG",
  [LogLevel.INFO]: "INFO",
  [LogLevel.WARN]: "WARN",
  [LogLevel.ERROR]: "ERROR",
};

interface FormattedMessage {
  timestamp: string;
  level: string;
  context: string | null;
  message: string;
  meta: Record<string, unknown>;
  formatted: string;
}

class Logger {
  private currentLevel: LogLevelValue;
  private context: string | null;

  constructor() {
    this.currentLevel = this.getDefaultLogLevel();
    this.context = null;
  }

  private getDefaultLogLevel(): LogLevelValue {
    const env = import.meta.env.MODE;

    const isProduction = env === "production";
    if (isProduction) {
      return LogLevel.WARN;
    }

    const isTest = env === "test";
    if (isTest) {
      return LogLevel.SILENT;
    }

    return LogLevel.DEBUG;
  }

  setLevel(level: LogLevelValue): void {
    const isValidLevel = Object.values(LogLevel).includes(level);
    if (!isValidLevel) {
      console.warn(`Invalid log level: ${level}`);
      return;
    }
    this.currentLevel = level;
  }

  setContext(context: string): void {
    this.context = context;
  }

  clearContext(): void {
    this.context = null;
  }

  private formatMessage(level: LogLevelValue, message: string, meta: Record<string, unknown>): FormattedMessage {
    const timestamp = new Date().toISOString();
    const levelName = LogLevelNames[level];
    const contextPrefix = this.context ? `[${this.context}]` : "";

    return {
      timestamp,
      level: levelName,
      context: this.context,
      message,
      meta,
      formatted: `${timestamp} ${levelName} ${contextPrefix} ${message}`,
    };
  }

  private shouldLog(level: LogLevelValue): boolean {
    return level >= this.currentLevel;
  }

  debug(message: string, meta: Record<string, unknown> = {}): void {
    const isDebugEnabled = this.shouldLog(LogLevel.DEBUG);
    if (!isDebugEnabled) return;

    const formatted = this.formatMessage(LogLevel.DEBUG, message, meta);
    console.debug(formatted.formatted, meta);
  }

  info(message: string, meta: Record<string, unknown> = {}): void {
    const isInfoEnabled = this.shouldLog(LogLevel.INFO);
    if (!isInfoEnabled) return;

    const formatted = this.formatMessage(LogLevel.INFO, message, meta);
    console.info(formatted.formatted, meta);
  }

  warn(message: string, meta: Record<string, unknown> = {}): void {
    const isWarnEnabled = this.shouldLog(LogLevel.WARN);
    if (!isWarnEnabled) return;

    const formatted = this.formatMessage(LogLevel.WARN, message, meta);
    console.warn(formatted.formatted, meta);
  }

  error(message: string, error: Error | null = null, meta: Record<string, unknown> = {}): void {
    const isErrorEnabled = this.shouldLog(LogLevel.ERROR);
    if (!isErrorEnabled) return;

    const hasError = error !== null;
    const errorMeta = hasError
      ? { ...meta, error: { message: error.message, stack: error.stack } }
      : meta;
    const formatted = this.formatMessage(LogLevel.ERROR, message, errorMeta);
    console.error(formatted.formatted, errorMeta);
  }

  withContext(context: string): Logger {
    const contextLogger = new Logger();
    contextLogger.currentLevel = this.currentLevel;
    contextLogger.context = context;
    return contextLogger;
  }
}

export const logger = new Logger();

export { LogLevel };
export type { LogLevelValue };
