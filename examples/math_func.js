'use strict';

const MathFunc = function ({ $ip }, { numA, numB, numC, numD }) {
  const ipNumber = Number($ip.slice(0, IP_NUMBER_LENGTH));
  return ipNumber + (numA * numB) + (numC * numD);
};

const IP_NUMBER_LENGTH = 3;

module.exports = MathFunc;
