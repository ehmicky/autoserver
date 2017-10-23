'use strict';

const MathFunc = function ({ $IP }, helpers, { numA, numB, numC, numD }) {
  const ipNumber = Number($IP.slice(0, IP_NUMBER_LENGTH));
  return ipNumber + (numA * numB) + (numC * numD);
};

const IP_NUMBER_LENGTH = 3;

module.exports = MathFunc;
