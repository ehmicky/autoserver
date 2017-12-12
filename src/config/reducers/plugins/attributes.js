'use strict';

const pluralize = require('pluralize');

const { throwError } = require('../../../error');
const { getWordsList, intersection } = require('../../../utilities');
const { mapColls } = require('../../helpers');

// Generic plugin factory
// It adds attributes to each collection, using `getAttributes(pluginOpts)`
// option which returns the attributes
const attributesPlugin = function ({ getAttributes = () => ({}) }) {
  return plugin.bind(null, getAttributes);
};

const plugin = function (
  getAttributes,
  { config, config: { collections }, opts },
) {
  if (!collections) { return; }

  const newAttrs = getAttributes(opts);

  const func = mergeNewAttrs.bind(null, newAttrs);
  const configA = mapColls(func, { config });

  return configA;
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
