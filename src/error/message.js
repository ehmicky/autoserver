'use strict';


const getErrorMessage = function ({
  error: {
    type,
    description,
    protocol,
    interface: interf,
    action_path,
    command,
    details,
  },
}) {
  const stack = getStack(description, details);

  const message = [
    protocol,
    interf,
    action_path,
    command,
  ].filter(val => val)
    .join(' ');

  const messageStack = message && stack
    ? `${message}\n${stack}`
    : message ? message : stack;
  const fullMessage = messageStack ? `${type} - ${messageStack}` : type;

  return fullMessage;
};

const getStack = function (description, details = '') {
  const stack = details.indexOf(description) !== -1
    ? details
    : `${description}\n${details}`;

  const dirPrefixRegExp = new RegExp(global.apiEngineDirName, 'g');
  const trimmedStack = stack.replace(dirPrefixRegExp, '');

  return trimmedStack;
};


module.exports = {
  getErrorMessage,
};
