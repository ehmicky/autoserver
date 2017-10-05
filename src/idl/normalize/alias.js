'use strict';

const { omit, assignObject } = require('../../utilities');
const { throwError } = require('../../error');

// Transforms can copy each `alias` as a real attribute,
// and set `aliasOf` property
const normalizeAliases = function (model) {
  if (!model.attributes) { return model; }

  const attributes = Object.entries(model.attributes)
    .reduce(normalizeAlias.bind(null, model), {});

  return { ...model, attributes };
};

const normalizeAlias = function (model, attrs, [attrName, attr]) {
  const aliases = createAliases({ model, attrs, attr, attrName });
  return { ...attrs, ...aliases, [attrName]: attr };
};

const createAliases = function ({ model, attrs, attr, attrName }) {
  if (!attr.alias) { return {}; }
  const aliases = Array.isArray(attr.alias) ? attr.alias : [attr.alias];

  return aliases
    .map(alias => createAlias({ model, attrs, attr, attrName, alias }))
    .reduce(assignObject, {});
};

const createAlias = function ({ model, attrs, attr, attrName, alias }) {
  checkAliasDuplicates({ model, attrs, attrName, alias });

  const aliasAttr = omit(attr, 'alias');
  const attrA = { ...aliasAttr, aliasOf: attrName };

  return { [alias]: attrA };
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

module.exports = {
  normalizeAliases,
};
