'use strict';


const { uniq } = require('lodash');

const { validate } = require('../../validation');
const { actions } = require('../../constants');


/**
 * API basic validation layer
 * Check API input, for the errors that should not happen,
 * i.e. server-side (e.g. 500)
 * In short: `action`, `args`, `modelName` should be defined and of the
 * right type
 **/
const basicValidation = async function ({ idl: { models } = {} }) {
  return async function basicValidation(input) {
    const {
      modelName,
      args,
      sysArgs,
      params,
      info,
      action,
      actionType,
    } = input;

    const schema = getValidateServerSchema({ models });
    const data = {
      modelName,
      args,
      sysArgs,
      params,
      info,
      action,
      actionType,
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
      'action',
      'actionType',
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
      action: {
        type: 'string',
        enum: actionNames,
      },
      actionType: {
        type: 'string',
        enum: actionGenericNames,
      },
    },
  };
};
const actionNames = actions.map(({ name }) => name);
const actionGenericNames = uniq(actions.map(({ actionType }) => actionType));


module.exports = {
  basicValidation,
};
