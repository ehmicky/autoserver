'use strict';

const { cloneDeep } = require('lodash');
const { toSentence } = require('underscore.string');

const { mapValues, omit, assignObject } = require('../../../utilities');
const { throwError } = require('../../../error');

// Transforms can copy each `alias` as a real attribute,
// and set `aliasOf` property
const normalizeAliases = function (model) {
  if (!model.properties) { return; }

  const propsA = Object.entries(model.properties)
    .reduce((props, [attrName, attr]) => {
      const aliases = createAliases({ model, props, attr, attrName });
      return { ...props, ...aliases, [attrName]: attr };
    }, {});

  const properties = mapValues(propsA, attr => addAliasDescription({ attr }));

  return { properties };
};

const createAliases = function ({ model, props, attr, attrName }) {
  if (!attr.alias) { return {}; }
  const aliases = Array.isArray(attr.alias) ? attr.alias : [attr.alias];

  return aliases
    .map(alias => {
      checkAliasDuplicates({ model, props, attrName, alias });

      const aliasAttr = omit(cloneDeep(attr), 'alias');
      const attrA = { ...aliasAttr, aliasOf: attrName };

      return { [alias]: attrA };
    })
    .reduce(assignObject, {});
};

const checkAliasDuplicates = function ({ model, props, attrName, alias }) {
  if (model.properties[alias]) {
    const message = `Attribute '${attrName}' cannot have an alias '${alias}' because this attribute already exists`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  if (props[alias]) {
    const otherAttrName = props[alias].aliasOf;
    const message = `Attributes '${otherAttrName}' and '${attrName}' cannot have the same alias '${alias}'`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }
};

// Add information about aliases in `description`
const addAliasDescription = function ({ attr }) {
  if (!attr.description) { return attr; }

  const aliasesDescription = getAliasesDescription({ attr });
  const aliasOfDescription = getAliasOfDescription({ attr });

  const description = [
    aliasesDescription,
    aliasOfDescription,
    attr.description,
  ].filter(val => val)
    .join('\n');

  return { ...attr, description };
};

const getAliasesDescription = function ({ attr }) {
  if (!attr.alias) { return ''; }

  const aliases = Array.isArray(attr.alias) ? attr.alias : [attr.alias];
  const aliasNames = toSentence(aliases.map(alias => `'${alias}'`));
  return `Aliases: ${aliasNames}.`;
};

const getAliasOfDescription = function ({ attr }) {
  if (!attr.aliasOf) { return ''; }

  return `Alias of: '${attr.aliasOf}'`;
};

module.exports = {
  normalizeAliases,
};
