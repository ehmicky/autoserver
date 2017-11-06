'use strict';

// Like array.sort() but does not mutate argument
const sortArray = function (array, func) {
  // eslint-disable-next-line fp/no-mutating-methods
  return [...array].sort(func);
};

// Like __.orderby() but faster, and using the same format we use in `orderby`
const sortBy = function (array, orderby) {
  return sortArray(
    array,
    (objA, objB) => sortByFunc({ objA, objB, orderby }),
  );
};

const sortByFunc = function ({ objA, objB, orderby }) {
  const orderbyPart = orderby
    .find(({ attrName: attrNameA }) => objA[attrNameA] !== objB[attrNameA]);

  if (orderbyPart === undefined) { return 0; }

  const { attrName, order } = orderbyPart;
  const compResult = objA[attrName] < objB[attrName] ? -1 : 1;
  const compResultA = order === 'desc' ? compResult * -1 : compResult;
  return compResultA;
};

module.exports = {
  sortArray,
  sortBy,
};
