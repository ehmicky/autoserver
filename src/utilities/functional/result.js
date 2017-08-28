'use strict';

// Like Lodash result(), but faster
const result = function (val, ...args) {
  if (typeof val !== 'function') { return val; }

  return val(...args);
};

module.exports = {
  result,
};
