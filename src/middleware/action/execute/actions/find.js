'use strict';

const readCommand = ({ action: { multiple: isMultiple } }) => ({
  commandType: 'read',
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
