'use strict';


const { magenta, green, yellow, red, dim } = require('chalk');


const colorize = function (level, message) {
  const [, first, second, third, , fourth = ''] = messageRegExp.test(message)
    ? messageRegExp.exec(message)
    : shortMessageRexExp.exec(message);

  const colorMessage = [
    colors[level].bold(first),
    colors[level](second),
    third,
    dim(fourth),
  ].join(' ');

  return colorMessage;
};

// Look for [...] [...] [...] [...] ... - ...
const messageRegExp = /^(\[[^\]]*\] \[[^\]]*\]) (\[[^\]]*\] \[[^\]]*\]) ((.|\n|\r)*) (- (.|\n|\r)*)/;
// Look for [...] [...] [...] [...] ...
const shortMessageRexExp = /^(\[[^\]]*\] \[[^\]]*\]) (\[[^\]]*\] \[[^\]]*\]) ((.|\n|\r)*)/;

const colors = {
  info: magenta,
  log: green,
  warn: yellow,
  error: red,
};


module.exports = {
  colorize,
};
