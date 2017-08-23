'use strict';

// Add command-related information
const addCommandInfoIn = function ({ command }) {
  return {
    reqInfo: { command: command.name },
    ifvParams: { $COMMAND: command.type },
  };
};

module.exports = {
  addCommandInfoIn,
};
