'use strict';

// Like array.sort() but does not mutate argument
const sortArray = function (array, func) {
  // eslint-disable-next-line fp/no-mutating-methods
  return [...array].sort(func);
};

// Like Lodash order() but faster, and using the same format we use in `order`
const sortBy = function (array, order) {
  return sortArray(
    array,
    (objA, objB) => sortByFunc({ objA, objB, order }),
  );
};

const sortByFunc = function ({ objA, objB, order }) {
  const orderPart = order
    .find(({ attrName: attrNameA }) => objA[attrNameA] !== objB[attrNameA]);

  if (orderPart === undefined) { return 0; }

  const { attrName, dir } = orderPart;
  const compResult = objA[attrName] < objB[attrName] ? -1 : 1;
  const compResultA = dir === 'desc' ? compResult * -1 : compResult;
  return compResultA;
};

module.exports = {
  sortArray,
  sortBy,
};
