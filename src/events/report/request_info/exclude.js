'use strict';

const { omit } = require('../../../utilities');

const removeKeys = function (requestInfo) {
  return omit(requestInfo, excludedKeys);
};

const excludedKeys = [
  // Those are already present in errorInfo
  'action',
  'fullAction',
  'model',
  'args',
  'command',
];

module.exports = {
  removeKeys,
};
