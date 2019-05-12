# tiny-console-logger [![Build status](https://travis-ci.org/marcelbeumer/tiny-console-logger.svg?branch=master)](https://travis-ci.org/marcelbeumer/tiny-console-logger) [![NPM version](https://flat.badgen.net/npm/v/tiny-console-logger/latest)](https://www.npmjs.com/package/tiny-console-logger) [![Bundle size](https://badgen.net/bundlephobia/minzip/tiny-console-logger)](https://bundlephobia.com/result?p=tiny-console-logger)

Small and super simple console logger with log level, formatter and custom reporter support. Runs in node and the browser, written in TypeScript.

## Installation

```
npm i tiny-console-logger
```

## Getting started

```ts
import createLogger, { LogLevel } from 'tiny-console-logger';

const logger = createLogger();
logger.setLevel(LogLevel.INFO);
logger.log('Hello');
```

## Log levels

- `LogLevel.ERROR`: allows `.error` calls
- `LogLevel.WARN`: allows `.warn` calls and calls above
- `LogLevel.INFO`: allows `.log` and `.info` calls and calls above
- `LogLevel.DEBUG`: allows `.debug` calls and calls above
- `LogLevel.TRACE`: allows `.trace` calls and calls above

## Reporters

A reporter does the actual logging. The default reporter uses the global `console`, but it's also possible to use a custom reporter:

```ts
const arrayLog = [];
logger.setReporter((args, methodName, logLevel) => {
  arrayLog.push(`[${logLevel}] ${args.map(String).join(' ')}`);
});
```

Because reporters are functions, they are easy to combine:

```ts
import createLogger, { defaultReporter } from 'tiny-console-logger';

const arrayLog = [];
const logger = createLogger();

logger.setReporter((args, methodName, logLevel) => {
  arrayLog.push(`[${logLevel}] ${args.map(String).join(' ')}`);
  defaultReporter(args, methodName, logLevel);
});
```

## Formatters

A formatter modifies arguments passed to the reporter. The default formatter just returns arguments as-is, but it's possible to use a custom formatter:

```ts
logger.setFormatter(args => ['[prefix]', ...args]);
```

Or:

```ts
logger.setFormatter((args, methodName, logLevel) => [
  `[${logLevel}:prefix]`,
  ...args,
  `(console.${methodName})`
]);
```

## Methods

#### Logging methods

- `trace(...args: any[])`
- `debug(...args: any[])`
- `info(...args: any[])`
- `log(...args: any[])`
- `warn(...args: any[])`
- `error(...args: any[])`

#### `setLevel(level: LogLevel)`

Sets the log level.

```
logger.setLevel(LogLevel.ERROR)
```

#### `getLevel(): LogLevel`

Returns the current log level.

#### `setFormatter(formatter: Formatter)`

Sets [custom formatter](#formatters).

#### `setReporter(reporter: Reporter)`

Sets [custom reporter](#reporters).
