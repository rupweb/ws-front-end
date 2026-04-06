const pad = (value, length = 2) => value.toString().padStart(length, '0');

const formatUtcTransactTime = (date = new Date()) => (
  `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
  `-${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}.${pad(date.getUTCMilliseconds(), 3)}`
);

export { formatUtcTransactTime };
