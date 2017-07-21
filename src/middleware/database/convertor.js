'use strict';

const { pick } = require('../../utilities');

// Converts from Command format to Database format
const databaseConvertor = async function (input) {
  const nextInput = pick(input, databaseAttributes);
  const response = await this.next(nextInput);
  return response;
};

const databaseAttributes = [
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
