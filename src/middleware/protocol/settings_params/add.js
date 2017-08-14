'use strict';

const { addJsl } = require('../../../jsl');
const { addReqInfo } = require('../../../events');

const addValues = function ({ input, values, type: { jslName, genericName } }) {
  const inputA = addJsl(input, { [jslName]: values });
  const inputB = addReqInfo(inputA, { [genericName]: values });
  const inputC = { ...inputB, [genericName]: values };
  return inputC;
};

module.exports = {
  addValues,
};
