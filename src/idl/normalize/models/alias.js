'use strict';

const { cloneDeep } = require('lodash');
const { toSentence } = require('underscore.string');

const { mapValues, omit, assignObject } = require('../../../utilities');
const { throwError } = require('../../../error');

// Transforms can copy each `alias` as a real attribute,
// and set `aliasOf` property
const normalizeAliases = function (model) {
  if (!model.properties) { return; }

  const newProps = Object.entries(model.properties)
    .reduce((props, [attrName, attr]) => {
      const aliases = createAliases({ model, props, attr, attrName });
      Object.assign(props, aliases);

      props[attrName] = attr;
      return props;
    }, {});

  const properties = mapValues(newProps, attr => {
    addAliasDescription({ attr });
    return attr;
  });

  return { properties };
};

const createAliases = function ({ model, props, attr, attrName }) {
  if (!attr.alias) { return; }
  const aliases = Array.isArray(attr.alias) ? attr.alias : [attr.alias];

  return aliases
    .map(alias => {
      checkAliasDuplicates({ model, props, attrName, alias });

      const aliasAttr = omit(cloneDeep(attr), 'alias');
      const newAttr = Object.assign({}, aliasAttr, { aliasOf: attrName });

      return { [alias]: newAttr };
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
  if (attr.alias) {
    const aliases = Array.isArray(attr.alias) ? attr.alias : [attr.alias];
    const aliasNames = toSentence(aliases.map(alias => `'${alias}'`));
    const description = getDescription({ attr });
    attr.description = `Aliases: ${aliasNames}.${description}`;
  }

  if (attr.aliasOf) {
    const description = getDescription({ attr });
    attr.description = `Alias of: '${attr.aliasOf}'.${description}`;
  }
};

const getDescription = function ({ attr: { description } }) {
  return description ? `\n${description}` : '';
};

module.exports = {
  normalizeAliases,
};
