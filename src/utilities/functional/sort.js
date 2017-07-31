'use strict';

// Like array.sort() but does not mutate argument
const sortArray = function (array, func) {
  // eslint-disable-next-line fp/no-mutating-methods
  return [...array].sort(func);
};

module.exports = {
  sortArray,
};
