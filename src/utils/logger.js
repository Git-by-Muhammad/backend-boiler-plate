const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const configuredLevel = process.env.LOG_LEVEL || 'info';
const threshold = levels[configuredLevel] ?? levels.info;

const shouldLog = (level) => levels[level] <= threshold;

const log = (level, ...args) => {
  if (!shouldLog(level)) return;
  const line = `[${new Date().toISOString()}] [${level.toUpperCase()}]`;
  if (level === 'error') return console.error(line, ...args);
  if (level === 'warn') return console.warn(line, ...args);
  return console.log(line, ...args);
};

const logger = {
  info: (...args) => log('info', ...args),
  warn: (...args) => log('warn', ...args),
  error: (...args) => log('error', ...args),
  debug: (...args) => log('debug', ...args),
};

module.exports = logger;

