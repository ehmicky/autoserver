'use strict';

const { intersection } = require('lodash');
const { toSentence } = require('underscore.string');
const pluralize = require('pluralize');

const { throwError } = require('../../../error');
const { mapValues } = require('../../../utilities');

// Generic plugin factory
// It adds attributes to each model, using `getAttributes(pluginOpts)` option
// which returns the attributes
const attributesPlugin = function ({ getAttributes = () => ({}) }) {
  return ({ idl, idl: { models }, opts }) => {
    if (!models) { return idl; }

    const newAttrs = getAttributes(opts);

    const modelsA = mapValues(
      models,
      (model, modelName) => getNewModel({ model, modelName, newAttrs }),
    );
    return { ...idl, models: modelsA };
  };
};

const getNewModel = function ({
  model,
  model: { attributes = {} },
  modelName,
  newAttrs,
}) {
  validateAttrs({ attributes, modelName, newAttrs });

  return { ...model, attributes: { ...attributes, ...newAttrs } };
};

// Make sure plugin does not override user-defined attributes
const validateAttrs = function ({ attributes, modelName, newAttrs }) {
  const attrNames = Object.keys(attributes);
  const newAttrNames = Object.keys(newAttrs);
  const alreadyDefinedAttrs = intersection(attrNames, newAttrNames);
  if (alreadyDefinedAttrs.length === 0) { return; }

  // Returns human-friendly version of attributes, e.g. 'attribute my_attr' or
  // 'attributes my_attr and my_other_attr'
  const attrsName = pluralize('attributes', newAttrs.length);
  const attrsValue = toSentence(newAttrs);
  const message = `In model ${modelName}, cannot override ${attrsName} ${attrsValue}`;
  throwError(message, { reason: 'IDL_VALIDATION' });
};

module.exports = {
  attributesPlugin,
};
