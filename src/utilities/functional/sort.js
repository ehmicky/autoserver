'use strict';

// Like array.sort() but does not mutate argument
const sortArray = function (array, func) {
  // eslint-disable-next-line fp/no-mutating-methods
  return [...array].sort(func);
};

// Like __.orderBy() but faster, and using the same format we use in `orderBy`
const sortBy = function (array, orderBy) {
  return sortArray(
    array,
    (objA, objB) => sortByFunc({ objA, objB, orderBy }),
  );
};

const sortByFunc = function ({ objA, objB, orderBy }) {
  const orderByPart = orderBy
    .find(({ attrName: attrNameA }) => objA[attrNameA] !== objB[attrNameA]);

  if (orderByPart === undefined) { return 0; }

  const { attrName, order } = orderByPart;
  const compResult = objA[attrName] < objB[attrName] ? -1 : 1;
  const compResultA = order === 'desc' ? compResult * -1 : compResult;
  return compResultA;
};

module.exports = {
  sortArray,
  sortBy,
};
