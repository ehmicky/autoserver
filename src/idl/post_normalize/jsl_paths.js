'use strict';

const { getAll } = require('../../utilities');
const { isJsl } = require('../../jsl');

// Retrieve paths of every value in IDL that uses inline JSL
const addJslPaths = function ({ idl }) {
  const jslPaths = getAll(idl)
    .filter(([jsl]) => isJsl({ jsl }))
    .map(([, key]) => key);
  return { ...idl, jslPaths };
};

module.exports = {
  addJslPaths,
};
