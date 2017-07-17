'use strict';

const { memoize, assignArray } = require('../../utilities');

// Retrieves all global variables, to make sure JSL does not access them
// This is memoized, i.e. no global variables should be added runtime,
// as they could be accessed in JSL
const getGlobalKeys = memoize(({ type }) => {
  const globalObjects = [
    global,
    // Since global is an object, Object constructor and prototype are
    // global properties too
    Object.getPrototypeOf(global),
    Object.getPrototypeOf(Object.getPrototypeOf(global)),
  ];
  const globalKeys = globalObjects
    // Retrieves all global properties
    .map(globalObj => Object.getOwnPropertyNames(globalObj)
      .filter(key => !whitelistedGlobalKeys[type].includes(key)))
    .reduce(assignArray, [])
    // Make sure it is sorted, for the memoizer
    .sort();
  return globalKeys;
});

// Whitelist those global properties as safe, i.e. they can be used in JSL
const systemWhitelistedKeys = [
  'String',
  'Number',
  'Boolean',
  'Date',
  'RegExp',
  'Array',
  'Object',
  'undefined',
  'NaN',
  'Infinity',

  'Intl',
  'JSON',
  'Math',

  'isFinite',
  'isNaN',
  'parseFloat',
  'parseInt',
  'decodeURIComponent',
  'encodeURIComponent',
  'decodeURI',
  'encodeURI',
];
const filterWhitelistedKeys = [
  'Date',
  'undefined',
  'NaN',
  'Infinity',
];
const whitelistedGlobalKeys = {
  system: systemWhitelistedKeys,
  startup: systemWhitelistedKeys,
  data: systemWhitelistedKeys,
  filter: filterWhitelistedKeys,
};

module.exports = {
  getGlobalKeys,
};
