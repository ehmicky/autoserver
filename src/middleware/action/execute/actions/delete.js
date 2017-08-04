'use strict';

const deleteCommand = {
  commandType: 'delete',
};

// 'delete' action uses a single 'delete' command
const deleteAction = [
  { input: deleteCommand },
];

module.exports = {
  delete: deleteAction,
};
