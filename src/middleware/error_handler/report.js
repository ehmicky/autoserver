'use strict';


const reportError = function ({ log, error }) {
  const {
    type,
    description,
    protocol,
    interface: interf,
    action_path,
    command,
    details,
  } = error;
  const stack = details && details.indexOf(description) !== -1
    ? details
    : `${description}\n${details}`;
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
  log.error(message, { type: 'failure', errorInfo: error });
};


module.exports = {
  reportError,
};
