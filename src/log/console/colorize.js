'use strict';

const { magenta, green, yellow, red, gray, reset, dim } = require('chalk');

// Colorize a standard error message
// Not performed if terminal does not support colors
const colorize = function ({ vars: { event, level }, consoleMessage }) {
  const [
    ,
    first,
    second,
    ,
    third,
    ,
    fourth = '',
  ] = MESSAGE_REGEXP.test(consoleMessage)
    ? MESSAGE_REGEXP.exec(consoleMessage)
    : SHORTMESSAGE_REXEXP.exec(consoleMessage);

  const coloredFourth = event === 'failure'
    ? colorStack({ stack: fourth })
    : dim(fourth);

  const colorMessage = [
    colors[level].bold(first),
    colors[level](second),
    third,
    coloredFourth,
  ].join(' ');

  return colorMessage;
};

// Look for [...] [...] [...] [...] [...] ([...]) ... - ...
const MESSAGE_REGEXP = /^(\[[^\]]*\] \[[^\]]*\]) (\[[^\]]*\] \[[^\]]*\] \[[^\]]*\] (\[[^\]]*\])?) ((.|\n)*) (- (.|\n)*)/;
// Look for [...] [...] [...] [...] [...] ([...]) ...
const SHORTMESSAGE_REXEXP = /^(\[[^\]]*\] \[[^\]]*\]) (\[[^\]]*\] \[[^\]]*\] \[[^\]]*\] (\[[^\]]*\])?) ((.|\n)*)/;

// Make it easy to read stack trace with color hints
const colorStack = function ({ stack }) {
  return stack
    // Error message is the most visible, other lines (stack trace) are gray
    .replace(/.*/, firstLine => reset.dim(firstLine))
    .replace(/(.*\n)(([^ ].*\n)*)/, (full, firstLine, secondLine) =>
      firstLine + reset(secondLine))
    .replace(/ {4,}at.*/g, allLines => gray(allLines))
    // Filepath is a bit more visible, and so is line number
    // eslint-disable-next-line max-params
    .replace(/(\/[^:]+)(:)(\d+)(:\d+)/g, (full, path, colon, line, loc) =>
      reset.dim(path) + gray(colon) + gray.bold(line) + gray(loc))
    // Filepath slashes are less visible, so the filenames are easy to pick
    .replace(/\//g, slash => gray(slash));
};

const colors = {
  info: magenta,
  log: green,
  warn: yellow,
  error: red,
};

module.exports = {
  colorize,
};
