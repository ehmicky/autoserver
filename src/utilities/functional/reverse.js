'use strict';

// Like array.reverse() but does not mutate argument
const reverseArray = function (array) {
  // eslint-disable-next-line fp/no-mutating-methods
  return [...array].reverse();
};

module.exports = {
  reverseArray,
};
