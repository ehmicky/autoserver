'use strict';

module.exports = {
  ACTIONS: require('./actions'),
  COMMANDS: require('./commands'),
  GOALS: require('./goals'),
  ...require('./content_types'),
};
