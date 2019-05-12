import sinon from 'sinon';
import assert from 'assert';
import createLogger, { LogLevel, Formatter, defaultReporter, defaultFormatter } from './index';

it('calls .trace on the reporter', () => {
  const reporter = sinon.spy();
  const logger = createLogger();
  logger.setReporter(reporter);
  logger.setLevel(LogLevel.TRACE);
  logger.trace('a', 'b', 'c');

  assert.strictEqual(reporter.callCount, 1);
  assert.deepStrictEqual(reporter.lastCall.args, [['a', 'b', 'c'], 'trace', 'trace']);
});

it('calls .debug on the reporter', () => {
  const reporter = sinon.spy();
  const logger = createLogger();
  logger.setReporter(reporter);
  logger.setLevel(LogLevel.DEBUG);
  logger.debug('a', 'b', 'c');

  assert.strictEqual(reporter.callCount, 1);
  assert.deepStrictEqual(reporter.lastCall.args, [['a', 'b', 'c'], 'debug', 'debug']);
});

it('calls .info on the reporter', () => {
  const reporter = sinon.spy();
  const logger = createLogger();
  logger.setReporter(reporter);
  logger.setLevel(LogLevel.INFO);
  logger.info('a', 'b', 'c');

  assert.strictEqual(reporter.callCount, 1);
  assert.deepStrictEqual(reporter.lastCall.args, [['a', 'b', 'c'], 'info', 'info']);
});

it('calls .log on the reporter on level INFO', () => {
  const reporter = sinon.spy();
  const logger = createLogger();
  logger.setReporter(reporter);
  logger.setLevel(LogLevel.INFO);
  logger.log('a', 'b', 'c');

  assert.strictEqual(reporter.callCount, 1);
  assert.deepStrictEqual(reporter.lastCall.args, [['a', 'b', 'c'], 'log', 'info']);
});

it('does not call .log on the reporter on level higher than INFO', () => {
  const reporter = sinon.spy();
  const logger = createLogger();
  logger.setReporter(reporter);
  logger.setLevel(LogLevel.WARN);
  logger.log('a', 'b', 'c');

  assert.strictEqual(reporter.callCount, 0);
});

it('calls .warn on the reporter', () => {
  const reporter = sinon.spy();
  const logger = createLogger();
  logger.setReporter(reporter);
  logger.setLevel(LogLevel.INFO);
  logger.warn('a', 'b', 'c');

  assert.strictEqual(reporter.callCount, 1);
  assert.deepStrictEqual(reporter.lastCall.args, [['a', 'b', 'c'], 'warn', 'warn']);
});

it('calls .error on the reporter', () => {
  const reporter = sinon.spy();
  const logger = createLogger();
  logger.setReporter(reporter);
  logger.setLevel(LogLevel.INFO);
  logger.error('a', 'b', 'c');

  assert.strictEqual(reporter.callCount, 1);
  assert.deepStrictEqual(reporter.lastCall.args, [['a', 'b', 'c'], 'error', 'error']);
});

it('does not log below log level', () => {
  const reporter = sinon.spy();
  const logger = createLogger();
  logger.setReporter(reporter);
  logger.setLevel(LogLevel.WARN);
  logger.info('a', 'b', 'c');

  assert.strictEqual(reporter.callCount, 0);
});

it('getLevel returns current logLevel', () => {
  const logger = createLogger();

  logger.setLevel(LogLevel.DEBUG);
  assert.strictEqual(logger.getLevel(), LogLevel.DEBUG);

  logger.setLevel(LogLevel.ERROR);
  assert.strictEqual(logger.getLevel(), LogLevel.ERROR);
});

it('sets default log level to warn', () => {
  const logger = createLogger();
  assert.strictEqual(logger.getLevel(), LogLevel.WARN);
});

it('allows a formatter to change arguments', () => {
  const reporter = sinon.spy();
  const formatter: Formatter = (args, methodName, logLevel) => [
    `[${logLevel.toUpperCase()}]`,
    ...args,
    `(reporter.${methodName})`
  ];
  const logger = createLogger();
  logger.setReporter(reporter);
  logger.setFormatter(formatter);
  logger.setLevel(LogLevel.INFO);
  logger.log('a', 'b', 'c');
  assert.strictEqual(reporter.callCount, 1);
  assert.deepStrictEqual(reporter.lastCall.args, [
    ['[INFO]', 'a', 'b', 'c', '(reporter.log)'],
    'log',
    'info'
  ]);
});

it('throws when setting unknown log level', () => {
  const logger = createLogger();
  logger.setLevel(LogLevel.INFO);

  assert.throws(() => (logger.setLevel as any)('xxx'));
});

describe('default reporter', () => {
  let warnSpy: sinon.SinonSpy;
  before(() => {
    warnSpy = sinon.spy(console, 'warn');
  });
  it('uses global console', () => {
    const logger = createLogger();
    logger.warn('a', 'b', 'c');
    assert.deepStrictEqual(warnSpy.lastCall.args, ['a', 'b', 'c']);
  });
  it('is exported', () => {
    const logger = createLogger();
    logger.setReporter(defaultReporter);
    logger.warn('a', 'b', 'c');
    assert.deepStrictEqual(warnSpy.lastCall.args, ['a', 'b', 'c']);
  });
  after(() => {
    warnSpy.restore();
  });
});

it('exports the default formatter', () => {
  const args = [1, 2, 3];
  assert.deepStrictEqual(defaultFormatter(args, 'log', LogLevel.INFO), args);
});
