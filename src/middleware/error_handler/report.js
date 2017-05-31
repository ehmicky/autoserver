'use strict';


const chalk = require('chalk');

const { STATUS_LEVEL_MAP } = require('../../logging');


const reportError = function ({ log, error = {} }) {
  if (!isError({ error })) { return; }

  const message = getErrorMessage(error);
  log.error(message, { type: 'failure', errorInfo: error });
};

// Only report except with status 'error'
// If we haven't reached the request logging middleware yet, error.status
// will be undefined, so it will still be caught and reporter.
const isError = function ({ error }) {
  const level = STATUS_LEVEL_MAP[error.status];
  return !level || level === 'error';
};

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
  reportError,
};
