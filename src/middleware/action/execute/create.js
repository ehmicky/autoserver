'use strict';

const createCommand = ({ input: { args: { data: argData } } }) => ({
  command: 'create',
  args: {
    pagination: false,
    newData: argData,
  },
});

/**
 * 'create' action uses a single 'create' command
 **/
const createAction = [
  { input: createCommand },
];

module.exports = {
  createAction,
};
