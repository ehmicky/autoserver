'use strict';

// Like Array.find(), but async
const findAsync = async function (array, filter, index) {
  const [value] = await findBaseAsync(array, filter, index);
  return value;
};

// Like Array.find(), but async, and returns value
const findValueAsync = async function (array, filter, index) {
  const [, value] = await findBaseAsync(array, filter, index);
  return value;
};

const findBaseAsync = async function (array, filter, index = 0) {
  if (array.length === index) { return []; }

  const val = array[index];
  const testVal = await filter(val, index, array);
  if (testVal) { return [val, testVal]; }

  return findBaseAsync(array, filter, index + 1);
};

module.exports = {
  findAsync,
  findValueAsync,
};
