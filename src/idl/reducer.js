'use strict';

const { reduceAsync } = require('../utilities');

// Small helper function to avoid repetition
const idlReducer = function (funcs, { idl, idlPath }) {
  return reduceAsync(funcs, (idlA, func) => func({ idl: idlA, idlPath }), idl);
};

module.exports = {
  idlReducer,
};
