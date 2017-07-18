'use strict';

const MathFunc = function ({ $IP }, { numA, numB, numC, numD }) {
  const ipNumber = Number($IP.slice(0, 3));
  return ipNumber + (numA * numB) + (numC * numD);
};

module.exports = MathFunc;
