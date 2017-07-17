'use strict';

const defaultValue = function ({ $COMMAND }) {
  return `happy ${$COMMAND}`;
};

module.exports = defaultValue;
