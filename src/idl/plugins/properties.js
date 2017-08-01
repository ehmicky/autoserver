'use strict';

const { intersection } = require('lodash');
const { toSentence } = require('underscore.string');
const pluralize = require('pluralize');

const { throwError } = require('../../error');
const { mapValues } = require('../../utilities');

// Generic plugin factory
// It adds properties to each model, using `getProperties(pluginOpts)` option
// which returns the properties
const propertiesPlugin = function ({ getProperties = () => ({}) }) {
  return ({ idl, opts }) => {
    const { models } = idl;
    if (!models) { return idl; }

    const properties = getProperties(opts);

    const modelsA = mapValues(models, (model, modelName) =>
      getNewModel({ model, modelName, properties })
    );
    return { ...idl, models: modelsA };
  };
};

const getNewModel = function ({ model, modelName, properties }) {
  const modelProperties = model.properties || {};

  validateProps({ modelProperties, modelName, properties });

  return { ...model, properties: { ...modelProperties, ...properties } };
};

// Make sure plugin does not override user-defined properties
const validateProps = function ({ modelProperties, modelName, properties }) {
  const propNames = Object.keys(modelProperties);
  const newPropNames = Object.keys(properties);

  const alreadyDefinedProps = intersection(propNames, newPropNames);
  if (alreadyDefinedProps.length === 0) { return; }

  // Returns human-friendly version of properties, e.g. 'property my_prop' or
  // 'properties my_prop and my_other_prop'
  const propsName = pluralize('properties', properties.length);
  const propsValue = toSentence(properties);
  const message = `In model ${modelName}, cannot override ${propsName} ${propsValue}`;
  throwError(message, { reason: 'IDL_VALIDATION' });
};

module.exports = {
  propertiesPlugin,
};
