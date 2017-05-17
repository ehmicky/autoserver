'use strict';


const { uniq } = require('lodash');

const { validate } = require('../../validation');
const { dbCalls } = require('../../idl');


/**
 * CRUD basic validation layer
 * Check API input, for the errors that should not happen,
 * i.e. server-side (e.g. 500)
 * In short: `action`, `args`, `modelName` should be defined and of the
 * right type
 **/
const crudBasicValidation = async function ({ idl: { models } = {} }) {
  return async function crudBasicValidation(input) {
    const {
      modelName,
      args,
      sysArgs,
      params,
      info,
      dbCall,
      dbCallFull,
    } = input;

    const schema = getValidateServerSchema({ models });
    const data = {
      modelName,
      args,
      sysArgs,
      params,
      info,
      dbCall,
      dbCallFull,
    };
    const reportInfo = { type: 'serverInputSyntax', dataVar: 'input' };
    validate({ schema, data, reportInfo });

    const response = await this.next(input);
    return response;
  };
};

// Get JSON schema to validate against input
const getValidateServerSchema = function ({ models = {} }) {
  const modelNames = Object.keys(models);

  return {
    required: [
      'modelName',
      'args',
      'sysArgs',
      'params',
      'info',
      'dbCall',
      'dbCallFull',
    ],
    properties: {
      modelName: {
        type: 'string',
        minLength: 1,
        enum: modelNames,
      },
      args: { type: 'object' },
      sysArgs: { type: 'object' },
      params: { type: 'object' },
      info: { type: 'object' },
      dbCall: {
        type: 'string',
        enum: dbCallGenericNames,
      },
      dbCallFull: {
        type: 'string',
        enum: dbCallNames,
      },
    },
  };
};
const dbCallNames = dbCalls.map(({ name }) => name);
const dbCallGenericNames = uniq(dbCalls.map(({ generic }) => generic));


module.exports = {
  crudBasicValidation,
};
