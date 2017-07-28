'use strict';

const { omit } = require('../../../utilities');

// Remove redundant keys present in both `errorInfo` and `requestInfo`
const trimErrorInfo = function ({ info: { errorInfo } }) {
  if (errorInfo === undefined) { return; }
  return omit(errorInfo, errorRedundantKeys);
};

const errorRedundantKeys = [
  'protocol_status',
  'protocol',
  'method',
  'headers',
  'queryVars',
  'operation',
  'action',
  'action_path',
  'model',
  'args',
  'command',
  'request_id',
];

module.exports = {
  trimErrorInfo,
};
