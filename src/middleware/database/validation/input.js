'use strict';

const { cloneDeep } = require('lodash');

const { pickBy } = require('../../../utilities');
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
      removeAllJsl({ value });
      const reportInfo = { type, dataVar };
      validate({ schema, data: value, reportInfo, extra: jsl });
    }
  }
};

/**
 * Keeps the arguments to validate
 **/
const getAttributes = function (args) {
  // TODO: validate `nFilter`
  return pickBy(args, (arg, dataVar) =>
    ['newData'].includes(dataVar) && arg
  );
};

// Do not validate JSL code
// TODO: remove when using MongoDB query objects
const removeAllJsl = function ({ value, parent, key }) {
  if (!value) { return; }

  if (typeof value === 'function' && parent) {
    return removeJsl({ parent, key });
  }

  recurseJsl({ value });
};

const removeJsl = function ({ parent, key }) {
  if (Array.isArray(parent)) {
    parent.splice(key, 1);
  } else if (parent.constructor === Object) {
    delete parent[key];
  }
};

const recurseJsl = function ({ value }) {
  if (!Array.isArray(value) && value.constructor !== Object) { return; }

  for (const [childKey, child] of Object.entries(value)) {
    return removeAllJsl({ value: child, parent: value, key: childKey });
  }
};

module.exports = {
  validateInputData,
};
