'use strict';

const deleteCommand = {
  commandType: 'delete',
};

// 'delete' action uses a single 'delete' command
const deleteAction = [
  { mInput: deleteCommand },
];

module.exports = {
  delete: deleteAction,
};
