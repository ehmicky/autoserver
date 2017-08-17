'use strict';

const { addIfv } = require('../../../idl_func');
const { addReqInfo } = require('../../../events');

const addValues = function ({
  input,
  values,
  type: { idlFuncName, genericName },
}) {
  const inputA = addIfv(input, { [idlFuncName]: values });
  const inputB = addReqInfo(inputA, { [genericName]: values });
  const inputC = { ...inputB, [genericName]: values };
  return inputC;
};

module.exports = {
  addValues,
};
