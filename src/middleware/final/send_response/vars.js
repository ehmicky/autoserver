'use strict';

const { getSumVars } = require('../../../functions');

// Add `response`-related schema variables
const getResponseVars = function ({ type, content }) {
  // `responsedatasize` and `responsedatacount` schema variables
  const sumVars = getSumVars({ attrName: 'responsedata', value: content });

  return {
    response: content,
    responsetype: type,
    responsedata: content,
    ...sumVars,
  };
};

module.exports = {
  getResponseVars,
};
