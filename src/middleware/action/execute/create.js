'use strict';

/**
 * "create" action uses a "create" command
 **/
const createAction = [
  {
    input: ({ input: { args: { data: argData } } }) => ({
      command: 'create',
      args: {
        pagination: false,
        newData: argData,
      },
    }),
  },
];

module.exports = {
  createAction,
};
