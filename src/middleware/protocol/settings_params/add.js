'use strict';

const { addJsl } = require('../../../jsl');
const { addLogInfo } = require('../../../logging');

const addValues = function ({ input, values, type: { jslName, genericName } }) {
  const inputA = addJsl(input, { [jslName]: values });
  const inputB = addLogInfo(inputA, { [genericName]: values });
  const inputC = { ...inputB, [genericName]: values };
  return inputC;
};

module.exports = {
  addValues,
};
