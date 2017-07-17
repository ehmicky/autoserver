'use strict';

const Math = function ({ $IP }, a, b, c, d) {
  const ipNumber = Number($IP.slice(0, 3));
  return ipNumber + (a * b) + (c * d);
};

module.exports = Math;
