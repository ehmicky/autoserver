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
    stack,
  ].filter(val => val)
    .join(' ');
  const fullMessage = message ? `${type} - ${message}` : type;

  return fullMessage;
};

const getStack = function (description, details = '') {
  const stack = details.indexOf(description) !== -1
    ? details
    : `${description}\n${details}`;

  const dirPrefixRegExp = new RegExp(global.apiEngineDirName, 'g');
  const trimmedStack = stack.replace(dirPrefixRegExp, '');

  const finalStack = trimmedStack ? `\n${trimmedStack}` : '';
  return finalStack;
};


module.exports = {
  getErrorMessage,
};
