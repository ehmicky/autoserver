'use strict';

const { pick } = require('../../utilities');
const { commonAttributes } = require('../common_attributes');

// Converts from Command format to Database format
const databaseConvertor = async function (nextFunc, input) {
  const inputA = pick(input, databaseAttributes);
  const response = await nextFunc(inputA);
  return response;
};

const databaseAttributes = [
  ...commonAttributes,
  'command',
  'args',
  'modelName',
  'params',
  'settings',
];

module.exports = {
  databaseConvertor,
};
