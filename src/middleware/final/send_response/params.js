'use strict';

const { getSumParams } = require('../../../utilities');

// Add `response`-related parameters
const getResponseParams = function ({ type, content }) {
  // `responsedatasize` and `responsedatacount` parameters
  const sumParams = getSumParams({ attrName: 'responsedata', value: content });

  return {
    response: content,
    responsetype: type,
    responsedata: content,
    ...sumParams,
  };
};

module.exports = {
  getResponseParams,
};
