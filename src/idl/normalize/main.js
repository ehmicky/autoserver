'use strict';


const { normalizeCommands } = require('./commands');
const { normalizeModels } = require('./models');
const { normalizeHelpers } = require('./helpers');
const { normalizeShortcuts } = require('./shortcuts');
const { normalizeGraphQL } = require('./graphql');


// Normalize IDL definition
const normalizeIdl = function ({ idl, serverOpts }) {
  idl = normalizeCommands({ idl });
  idl = normalizeModels({ idl });
  idl = normalizeHelpers({ idl });
  idl = normalizeShortcuts({ idl });
  idl = normalizeGraphQL({ idl, serverOpts });

  return idl;
};


module.exports = {
  normalizeIdl,
};
