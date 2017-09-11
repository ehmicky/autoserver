'use strict';

const { typenameResolver } = require('./typename');
const { metadataResolver } = require('./metadata');
const { normalResolver } = require('./normal');

// GraphQL-anywhere uses a single resolver: here it is
const getResolver = async function (
  modelsMap,
  { name, parent = {}, args, cbFunc },
) {
  // Introspection type name
  if (name === '__typename') {
    return typenameResolver({ parent });
  }

  // Metadata, e.g. pagination information
  if (name === '__metadata') {
    return metadataResolver({ parent });
  }

  const response = await normalResolver({
    modelsMap,
    name,
    parent,
    args,
    cbFunc,
  });
  return response;
};

module.exports = {
  getResolver,
};
