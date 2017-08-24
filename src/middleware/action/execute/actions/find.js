'use strict';

const readCommand = {
  commandType: 'read',
};

// 'find' action uses a single 'read' command
const findAction = [
  { mInput: readCommand },
];

module.exports = {
  find: findAction,
};
