'use strict';

const readCommand = ({ input: { action: { multiple: isMultiple } } }) => ({
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
  findAction,
};
