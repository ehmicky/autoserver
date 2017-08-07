'use strict';

const { magenta, green, yellow, red, gray, reset, dim } = require('chalk');

// Colorize a standard error message
// Not performed if `--no-color`, environment variable `FORCE_COLOR=0` or
// terminal does not support colors
const colorize = function ({ type, level, message }) {
  const [, first, second, third, , fourth = ''] = messageRegExp.test(message)
    ? messageRegExp.exec(message)
    : shortMessageRexExp.exec(message);

  const coloredFourth = type === 'failure'
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

// Look for [...] [...] [...] [...] ... - ...
const messageRegExp = /^(\[[^\]]*\] \[[^\]]*\]) (\[[^\]]*\] \[[^\]]*\] \[[^\]]*\]) ((.|\n)*) (- (.|\n)*)/;
// Look for [...] [...] [...] [...] ...
const shortMessageRexExp = /^(\[[^\]]*\] \[[^\]]*\]) (\[[^\]]*\] \[[^\]]*\] \[[^\]]*\]) ((.|\n)*)/;

// Make it easy to read stack trace with color hints
const colorStack = function ({ stack }) {
  return stack
    // Error message is the most visible, other lines (stack trace) are gray
    .replace(/.*/, firstLine => reset.dim(firstLine))
    .replace(/(.*\n)(([^ ].*\n)*)/, (_, firstLine, secondLine) =>
      firstLine + reset(secondLine))
    .replace(/ {4,}at.*/g, allLines => gray(allLines))
    // Filepath is a bit more visible, and so is line number
    // eslint-disable-next-line max-params
    .replace(/(\/[^:]+)(:)([0-9]+)(:[0-9]+)/g, (_, path, colon, line, loc) =>
      reset.dim(path) + gray(colon) + gray.bold(line) + gray(loc)
    )
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
