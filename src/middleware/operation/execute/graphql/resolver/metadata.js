'use strict';

const { attributeResolver } = require('./attribute');

// Resolver for __metadata
const metadataResolver = function ({ parent }) {
  return attributeResolver({ parent, name: '__metadata' }).directReturn;
};

module.exports = {
  metadataResolver,
};
