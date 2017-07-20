'use strict';

const deleteCommand = ({ action: { multiple: isMultiple } }) => ({
  commandType: 'delete',
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
  delete: deleteAction,
};
