'use strict';

const { pick } = require('../../utilities');

// Converts from Command format to Database format
const databaseConvertor = async function (nextFunc, input) {
  const nextInput = pick(input, databaseAttributes);
  const response = await nextFunc(nextInput);
  return response;
};

const databaseAttributes = [
  'currentPerf',
  'command',
  'args',
  'modelName',
  'jsl',
  'log',
  'perf',
  'idl',
  'serverOpts',
  'apiServer',
  'params',
  'settings',
];

module.exports = {
  databaseConvertor,
};
