'use strict';

const readCommand = ({ action: { multiple: isMultiple } }) => ({
  command: 'read',
  args: {
    pagination: isMultiple,
  },
});

/**
 * 'find' action uses a single 'read' command
 **/
const findAction = [
  { input: readCommand },
];

module.exports = {
  find: findAction,
};
