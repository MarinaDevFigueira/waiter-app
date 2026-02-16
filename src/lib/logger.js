const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  SILENT: 4,
};

const LogLevelNames = {
  [LogLevel.DEBUG]: "DEBUG",
  [LogLevel.INFO]: "INFO",
  [LogLevel.WARN]: "WARN",
  [LogLevel.ERROR]: "ERROR",
};

class Logger {
  constructor() {
    this.currentLevel = this.getDefaultLogLevel();
    this.context = null;
  }

  getDefaultLogLevel() {
    const env = import.meta.env.MODE;

    if (env === "production") {
      return LogLevel.WARN;
    }

    if (env === "test") {
      return LogLevel.SILENT;
    }

    return LogLevel.DEBUG;
  }

  setLevel(level) {
    const isValidLevel = Object.values(LogLevel).includes(level);
    if (!isValidLevel) {
      console.warn(`Invalid log level: ${level}`);
      return;
    }
    this.currentLevel = level;
  }

  setContext(context) {
    this.context = context;
  }

  clearContext() {
    this.context = null;
  }

  formatMessage(level, message, meta) {
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

  shouldLog(level) {
    return level >= this.currentLevel;
  }

  debug(message, meta = {}) {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const formatted = this.formatMessage(LogLevel.DEBUG, message, meta);
    console.debug(formatted.formatted, meta);
  }

  info(message, meta = {}) {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const formatted = this.formatMessage(LogLevel.INFO, message, meta);
    console.info(formatted.formatted, meta);
  }

  warn(message, meta = {}) {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const formatted = this.formatMessage(LogLevel.WARN, message, meta);
    console.warn(formatted.formatted, meta);
  }

  error(message, error = null, meta = {}) {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const errorMeta = error ? { ...meta, error: { message: error.message, stack: error.stack } } : meta;
    const formatted = this.formatMessage(LogLevel.ERROR, message, errorMeta);
    console.error(formatted.formatted, errorMeta);
  }

  withContext(context) {
    const contextLogger = new Logger();
    contextLogger.currentLevel = this.currentLevel;
    contextLogger.context = context;
    return contextLogger;
  }
}

export const logger = new Logger();

export { LogLevel };
