'use strict';

// Add command-related information
const addCommandInfoIn = function ({ command }) {
  return {
    ifvParams: { $COMMAND: command.type },
  };
};

module.exports = {
  addCommandInfoIn,
};
