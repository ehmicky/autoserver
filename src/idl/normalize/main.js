'use strict';


const { normalizeCommands } = require('./commands');
const { normalizeModels } = require('./models');
const { normalizeHelpers } = require('./helpers');


// Normalize IDL definition
const normalizeIdl = function (idl) {
  idl = normalizeCommands({ idl });
  idl = normalizeModels({ idl });
  idl = normalizeHelpers({ idl });
  return idl;
};


module.exports = {
  normalizeIdl,
};
