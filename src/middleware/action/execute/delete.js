'use strict';

const deleteCommand = ({ action: { multiple: isMultiple } }) => ({
  command: 'delete',
  args: {
    pagination: isMultiple,
  },
});

/**
 * 'delete' action uses a single 'delete' command
 **/
const deleteAction = [
  { input: deleteCommand },
];

module.exports = {
  deleteAction,
};
