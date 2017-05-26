'use strict';


const { memoize } = require('../../utilities');


// Retrieves all global variables, to make sure JSL does not access them
// This is memoized, i.e. no global variables should be added runtime,
// as they could be accessed in JSL
const getGlobalKeys = memoize(function ({ type }) {
  const globalObjects = [
    global,
    // Since global is an object, Object constructor and prototype are
    // global properties too
    global.__proto__,
    global.__proto__.__proto__,
  ];
  const globalKeys = globalObjects
    .reduce((keys, globalObj) => {
      // Retrieves all global properties
      const globalObjKeys = Object.getOwnPropertyNames(globalObj)
        .filter(key => !whitelistedGlobalKeys[type].includes(key));
      return [...keys, ...globalObjKeys];
    }, [])
    // Make sure it is sorted, for the memoizer
    .sort();
  return globalKeys;
});

// Whitelist those global properties as safe, i.e. they can be used in JSL
const systemWhitelistedGlobalKeys = [
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
const filterWhitelistedGlobalKeys = [
  'Date',
  'undefined',
  'NaN',
  'Infinity',
];
const whitelistedGlobalKeys = {
  system: systemWhitelistedGlobalKeys,
  startup: systemWhitelistedGlobalKeys,
  filter: filterWhitelistedGlobalKeys,
};

module.exports = {
  getGlobalKeys,
};
