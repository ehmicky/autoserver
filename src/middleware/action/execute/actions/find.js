'use strict';

const readCommand = {
  commandType: 'read',
};

// 'find' action uses a single 'read' command
const findAction = [
  { input: readCommand },
];

module.exports = {
  find: findAction,
};
