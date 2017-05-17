'use strict';


const { uniq } = require('lodash');

const { validate } = require('../../validation');
const { commands } = require('../../constants');


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
      commandType,
      commandName,
    } = input;

    const schema = getValidateServerSchema({ models });
    const data = {
      modelName,
      args,
      sysArgs,
      params,
      info,
      commandType,
      commandName,
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
      'commandType',
      'commandName',
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
      commandType: {
        type: 'string',
        enum: commandTypes,
      },
      commandName: {
        type: 'string',
        enum: commandNames,
      },
    },
  };
};
const commandNames = commands.map(({ name }) => name);
const commandTypes = uniq(commands.map(({ type }) => type));


module.exports = {
  crudBasicValidation,
};
