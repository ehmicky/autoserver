'use strict';

const pluralize = require('pluralize');

const { getWordsList, intersection } = require('../../../utilities');
const { throwError } = require('../../../error');
const { compile, validate } = require('../../../validation');
const { mapColls } = require('../../helpers');

// Generic plugin factory
// It adds attributes to each collection, using `getAttributes(pluginOpts)`
// option which returns the attributes
const attributesPlugin = function ({
  name,
  getAttributes = () => ({}),
  optsSchema,
  config,
  config: { collections },
  opts,
}) {
  if (!collections) { return; }

  validateOpts({ name, opts, optsSchema, collections });

  const newAttrs = getAttributes(opts);

  const func = mergeNewAttrs.bind(null, newAttrs);
  const configA = mapColls(func, { config });

  return configA;
};

// Validate plugin options against `optsSchema`
const validateOpts = function ({ name, opts = {}, optsSchema, collections }) {
  if (optsSchema === undefined) { return; }

  const jsonSchema = getJsonSchema({ optsSchema });
  const data = getData({ collections, opts });
  const compiledJsonSchema = compile({ jsonSchema });

  validate({
    compiledJsonSchema,
    data,
    dataVar: name,
    reason: 'CONF_VALIDATION',
    message: `Wrong '${name}' plugin configuration`,
  });
};

const getJsonSchema = function ({ optsSchema }) {
  return { type: 'object', properties: { plugin: optsSchema } };
};

const getData = function ({ collections, opts }) {
  const collTypes = Object.keys(collections);
  const data = {
    plugin: opts,
    dynamicVars: { collTypes },
  };
  return data;
};

const mergeNewAttrs = function (
  newAttrs,
  { coll: { attributes = {} }, collname },
) {
  validateAttrs({ attributes, collname, newAttrs });

  return { attributes: { ...attributes, ...newAttrs } };
};

// Make sure plugin does not override user-defined attributes
const validateAttrs = function ({ attributes, collname, newAttrs }) {
  const attrNames = Object.keys(attributes);
  const newAttrNames = Object.keys(newAttrs);
  const alreadyDefinedAttrs = intersection(attrNames, newAttrNames);
  if (alreadyDefinedAttrs.length === 0) { return; }

  // Returns human-friendly version of attributes, e.g. 'attribute my_attr' or
  // 'attributes my_attr and my_other_attr'
  const attrsName = pluralize('attributes', newAttrNames.length);
  const attrsValue = getWordsList(newAttrNames, { op: 'and', quotes: true });
  const message = `In collection '${collname}', cannot override ${attrsName} ${attrsValue}`;
  throwError(message, { reason: 'CONF_VALIDATION' });
};

module.exports = {
  attributesPlugin,
};
