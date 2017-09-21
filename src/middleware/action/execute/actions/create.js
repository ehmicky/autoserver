'use strict';

const createCommand = ({ args: { data: dataArg } }) => ({
  command: 'create',
  args: {
    newData: dataArg,
  },
});

// 'create' action uses a single 'create' command
const createAction = [
  { mInput: createCommand },
];

module.exports = {
  create: createAction,
};
