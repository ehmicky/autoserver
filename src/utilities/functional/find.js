'use strict';

// Like Array.find(), but async
const findAsync = async function (array, filter, index = 0) {
  if (array.length === index) { return; }

  const val = array[index];
  const testVal = await filter(val, index, array);
  if (testVal) { return val; }

  return findAsync(array, filter, index + 1);
};

module.exports = {
  findAsync,
};
