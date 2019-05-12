export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LoggingMethods {
  trace(...args: any[]): void;
  debug(...args: any[]): void;
  log(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}

export interface Logger extends LoggingMethods {
  setLevel(level: LogLevel): void;
  getLevel(): LogLevel;
  setFormatter(formatter: Formatter): void;
  setReporter(reporter: Reporter): void;
}

export interface Formatter {
  (args: any[], methodName: keyof LoggingMethods, logLevel: LogLevel): any[];
}

export interface Reporter {
  (args: any[], methodName: keyof LoggingMethods, logLevel: LogLevel): void;
}

export const defaultFormatter: Formatter = args => args;
export const defaultReporter: Reporter = (args, methodName) =>
  typeof console !== 'undefined' && console[methodName] && console[methodName](...args);

export default (): Logger => {
  const levelOrder = [LogLevel.TRACE, LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
  let currentLevelIndex = levelOrder.indexOf(LogLevel.WARN);
  let report = defaultReporter;
  let format = defaultFormatter;

  const createMethod = (methodName: keyof LoggingMethods, logLevel: LogLevel) => {
    const levelIndex = levelOrder.indexOf(logLevel);
    return (...args: any[]) => {
      if (currentLevelIndex > levelIndex) return;
      if (!format || !report) return;
      report(format(args, methodName, logLevel), methodName, logLevel);
    };
  };

  return {
    trace: createMethod('trace', LogLevel.TRACE),
    debug: createMethod('debug', LogLevel.DEBUG),
    log: createMethod('log', LogLevel.INFO),
    info: createMethod('info', LogLevel.INFO),
    warn: createMethod('warn', LogLevel.WARN),
    error: createMethod('error', LogLevel.ERROR),
    setLevel(logLevel: LogLevel) {
      const idx = levelOrder.indexOf(logLevel);
      if (idx === -1) throw new Error(`Unknown log level ${logLevel}`);
      currentLevelIndex = idx;
    },
    getLevel() {
      return levelOrder[currentLevelIndex];
    },
    setReporter(reporter: Reporter) {
      report = reporter;
    },
    setFormatter(formatter: Formatter) {
      format = formatter;
    }
  };
};
