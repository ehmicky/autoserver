'use strict';

// We do not want things like eval() which could circumvent our restrictions
const functionFuncNames = ['eval', 'Function', 'bind', 'call', 'apply'];

// Those functions create side-effects, e.g. assignments
const sideEffectsFuncNames = [
  'defineProperty',
  'defineProperties',
  'preventExtensions',
  'seal',
  'freeze',
  'setPrototypeOf',
  'splice',
  'fill',
  'copyWithin',
  'push',
  'pop',
  'unshift',
  'shift',
  'setDate',
  'setFullYear',
  'setHours',
  'setMilliseconds',
  'setMinutes',
  'setMonth',
  'setSeconds',
  'setTime',
  'setUTCDate',
  'setUTCFullYear',
  'setUTCHours',
  'setUTCMilliseconds',
  'setUTCMinutes',
  'setUTCMonth',
  'setUTCSeconds',
  'setYear',
];

// Those functions access global state
const globalFuncNames = ['for', 'keyFor'];

// Those functions imply async code
const asyncFuncNames = ['then', 'catch'];

module.exports = {
  functionFuncNames,
  sideEffectsFuncNames,
  globalFuncNames,
  asyncFuncNames,
};
