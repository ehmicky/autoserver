'use strict';


const chalk = require('chalk');


const getErrorMessage = function ({
  type,
  description,
  protocol,
  interface: interf,
  action_path,
  command,
  details,
}) {
  const stack = getStack(description, details);
  const message = [
    type,
    '-',
    protocol,
    interf,
    action_path,
    command,
    '\n',
    stack,
  ].filter(val => val)
    .join(' ');

  return message;
};

const getStack = function (description, details = '') {
  const stack = details.indexOf(description) !== -1
    ? details
    : `${description}\n${details}`;

  const dirPrefixRegExp = new RegExp(global.apiEngineDirName, 'g');
  const trimmedStack = stack.replace(dirPrefixRegExp, '');

  // Make it easy to read stack trace with color hints
  const coloredStack = trimmedStack
    // First line is the most visible, other lines are gray
    .replace(/.*/, firstLine => chalk.reset(firstLine))
    .replace(/.*/g, allLines => chalk.gray(allLines))
    // Filepath is a bit more visible
    .replace(/(\/[^:]+)(:[0-9]+:[0-9]+)/g, (_, path, fileLoc) => {
      return chalk.reset.dim(path) + chalk.gray(fileLoc);
    })
    // Filepath slashes are less visible, so the filenames are easy to pick
    .replace(/\//g, slash => chalk.gray(slash));

  return coloredStack;
};


module.exports = {
  getErrorMessage,
};
