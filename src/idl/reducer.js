'use strict';

const { reduceAsync } = require('../utilities');

// Small helper function to avoid repetition
const idlReducer = function (funcs, { idl, path }) {
  return reduceAsync(funcs, (idlA, func) => func({ idl: idlA, path }), idl);
};

module.exports = {
  idlReducer,
};
