'use strict';

/**
 * "delete" action uses a "delete" command
 **/
const deleteAction = [
  {
    input: ({ input: { action: { multiple: isMultiple } } }) => ({
      command: 'delete',
      args: {
        pagination: isMultiple,
      },
    }),
  },
];

module.exports = {
  deleteAction,
};
