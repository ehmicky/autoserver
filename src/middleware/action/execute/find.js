'use strict';

/**
 * "find" action uses a "read" command
 **/
const findAction = [
  {
    input: ({ input: { action: { multiple: isMultiple } } }) => ({
      command: 'read',
      args: {
        pagination: isMultiple,
      },
    }),
  },
];

module.exports = {
  findAction,
};
