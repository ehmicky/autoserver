'use strict';

const MathFunc = function ({ $IP }, helpers, { numA, numB, numC, numD }) {
  const ipNumber = Number($IP.slice(0, ipNumberLength));
  return ipNumber + (numA * numB) + (numC * numD);
};

const ipNumberLength = 3;

module.exports = MathFunc;
