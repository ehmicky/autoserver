'use strict';

// Fields description|deprecation_reason are taken from IDL definition
// Use the nested attribute's metadata, if this is a nested attribute
const getMetadata = function ({ def, def: { metadata = {} } }) {
  const {
    description,
    deprecation_reason: deprecationReason,
  } = { ...def, ...metadata };

  return { description, deprecationReason };
};

module.exports = {
  getMetadata,
};
