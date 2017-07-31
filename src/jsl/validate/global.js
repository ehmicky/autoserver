'use strict';

const { memoize, assignArray, sortArray } = require('../../utilities');

// eslint-disable-next-line no-restricted-globals
const globalVar = global;
const globalProto = Object.getPrototypeOf(globalVar);
const globalProtoProto = Object.getPrototypeOf(globalProto);
const globalObjects = [
  globalVar,
  // Since global is an object, Object constructor and prototype are
  // global properties too
  globalProto,
  globalProtoProto,
];

// Retrieves all global variables, to make sure JSL does not access them
// This is memoized, i.e. no global variables should be added runtime,
// as they could be accessed in JSL
const getGlobalKeys = function ({ type }) {
  const filteredGlobals = globalObjects
    .map(globalObj => filterGlobalObj({ globalObj, type }))
    .reduce(assignArray, []);
  // Make sure it is sorted, for the memoizer
  const sortedGlobals = sortArray(filteredGlobals);
  return sortedGlobals;
};

const mGetGlobalKeys = memoize(getGlobalKeys);

// Retrieves all global properties
const filterGlobalObj = function ({ globalObj, type }) {
  return Object.getOwnPropertyNames(globalObj)
    .filter(key => !whitelistedGlobalKeys[type].includes(key));
};

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
  getGlobalKeys: mGetGlobalKeys,
};
