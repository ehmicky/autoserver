'use strict';

const { toSentence } = require('underscore.string');

const { mapValues, omit, assignObject } = require('../../../utilities');
const { throwError } = require('../../../error');

// Transforms can copy each `alias` as a real attribute,
// and set `aliasOf` property
const normalizeAliases = function (model) {
  if (!model.attributes) { return model; }

  const attrsA = Object.entries(model.attributes)
    .reduce((attrs, [attrName, attr]) => {
      const aliases = createAliases({ model, attrs, attr, attrName });
      return { ...attrs, ...aliases, [attrName]: attr };
    }, {});

  const attributes = mapValues(attrsA, attr => addAliasDescription({ attr }));

  return { ...model, attributes };
};

const createAliases = function ({ model, attrs, attr, attrName }) {
  if (!attr.alias) { return {}; }
  const aliases = Array.isArray(attr.alias) ? attr.alias : [attr.alias];

  return aliases
    .map(alias => {
      checkAliasDuplicates({ model, attrs, attrName, alias });

      const aliasAttr = omit(attr, 'alias');
      const attrA = { ...aliasAttr, aliasOf: attrName };

      return { [alias]: attrA };
    })
    .reduce(assignObject, {});
};

const checkAliasDuplicates = function ({ model, attrs, attrName, alias }) {
  if (model.attributes[alias]) {
    const message = `Attribute '${attrName}' cannot have an alias '${alias}' because this attribute already exists`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  if (attrs[alias]) {
    const otherAttrName = attrs[alias].aliasOf;
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
