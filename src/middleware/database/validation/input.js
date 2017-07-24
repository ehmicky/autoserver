'use strict';

const { cloneDeep } = require('lodash');

const { pickBy, omitBy, fullRecurseMap } = require('../../../utilities');
const { validate } = require('../../../validation');

const { getDataValidationSchema } = require('./schema');

/**
 * Check that input nFilter|newData passes IDL validation
 * E.g. if a model is marked as `required` or `minimum: 10` in IDL file,
 * this will be validated here
 **/
const validateInputData = function ({ idl, modelName, command, args, jsl }) {
  const type = 'clientInputData';
  const schema = getDataValidationSchema({
    idl,
    modelName,
    command,
    type,
  });
  const attributes = getAttributes(args);

  for (const [dataVar, attribute] of Object.entries(attributes)) {
    const allAttrs = Array.isArray(attribute) ? attribute : [attribute];

    for (const data of allAttrs) {
      const value = cloneDeep(data);
      const newValue = removeAllJsl(value);
      const reportInfo = { type, dataVar };
      validate({ schema, data: newValue, reportInfo, extra: jsl });
    }
  }
};

/**
 * Keeps the arguments to validate
 **/
const getAttributes = function (args) {
  // TODO: validate `nFilter`
  return pickBy(args, (arg, dataVar) => ['newData'].includes(dataVar) && arg);
};

// Do not validate JSL code
// TODO: remove when using MongoDB query objects
const removeAllJsl = function (value) {
  return fullRecurseMap(value, removeJsl);
};

const removeJsl = function (value) {
  if (Array.isArray(value)) {
    return value.filter(child => typeof child !== 'function');
  }

  if (value && value.constructor === Object) {
    return omitBy(value, child => typeof child === 'function');
  }

  return value;
};

module.exports = {
  validateInputData,
};
