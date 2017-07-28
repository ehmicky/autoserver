'use strict';

const { uniq, intersection, difference } = require('lodash');
const { toSentence } = require('underscore.string');
const pluralize = require('pluralize');

const { throwError } = require('../../error');
const { mapValues } = require('../../utilities');

// Generic plugin factory
// It adds properties to each model, using `getProperties(pluginOpts)` option
// which returns the properties
// It also add required properties to each model, using
// `requiredProperties` option
const propertiesPlugin = function ({
  getProperties = () => ({}),
  requiredProperties = [],
}) {
  return ({ idl, opts }) => {
    const { models } = idl;
    if (!models) { return idl; }

    const properties = getProperties(opts);

    idl.models = mapValues(models, (model, modelName) =>
      getNewModel({ model, modelName, properties, requiredProperties })
    );
    return idl;
  };
};

const getNewModel = function ({
  model,
  modelName,
  properties,
  requiredProperties: required,
}) {
  const modelProperties = model.properties || {};

  validateProps({ modelProperties, modelName, properties, required });

  // Modifies models
  const propertiesA = { ...modelProperties, ...properties };
  const currentRequired = model.required || [];
  const requiredA = uniq([...currentRequired, ...required]);
  const modelA = { ...model, properties: propertiesA, required: requiredA };

  return modelA;
};

const validateProps = function ({
  modelProperties,
  modelName,
  properties,
  required,
}) {
  const propNames = Object.keys(modelProperties);
  const newPropNames = Object.keys(properties);

  validateDefinedProps({ modelName, propNames, newPropNames });
  validateMissingProps({ modelName, required, propNames, newPropNames });
};

// Make sure plugin does not override user-defined properties
const validateDefinedProps = function ({ modelName, propNames, newPropNames }) {
  const alreadyDefinedProps = intersection(propNames, newPropNames);
  if (alreadyDefinedProps.length === 0) { return; }

  const propMessage = getPropMessage(alreadyDefinedProps);
  const message = `In model ${modelName}, cannot override ${propMessage}`;
  throwError(message, { reason: 'IDL_VALIDATION' });
};

// Make sure plugin required properties exist
const validateMissingProps = function ({
  modelName,
  required,
  propNames,
  newPropNames,
}) {
  const missingRequiredProps = difference(
    required,
    [...propNames, ...newPropNames]
  );

  if (missingRequiredProps.length === 0) { return; }

  const propMessage = getPropMessage(missingRequiredProps);
  const message = `In model ${modelName}, ${propMessage} should exist`;
  throwError(message, { reason: 'IDL_VALIDATION' });
};

// Returns human-friendly version of properties, e.g. 'property my_prop' or
// 'properties my_prop and my_other_prop'
const getPropMessage = function (properties) {
  const propsName = pluralize('properties', properties.length);
  const propsValue = toSentence(properties);
  return `${propsName} ${propsValue}`;
};

module.exports = {
  propertiesPlugin,
};
