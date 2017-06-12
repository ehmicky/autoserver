'use strict';


const { cloneDeep } = require('lodash');

const { map } = require('../../utilities');
const { EngineError } = require('../../error');


// Transforms can copy each `alias` as a real attribute,
// and set `aliasOf` property
const normalizeAliases = function ({ models }) {
  return map(models, model => {
    if (!model.properties) { return model; }

    model.properties = Object.entries(model.properties)
      .reduce((props, [attrName, attr]) => {
        const aliases = createAliases({ model, props, attr, attrName });
        Object.assign(props, aliases);

        props[attrName] = attr;
        return props;
      }, {});

    return model;
  });
};

const createAliases = function ({ model, props, attr, attrName }) {
  if (!attr.alias) { return; }
  const aliases = attr.alias instanceof Array ? attr.alias : [attr.alias];

  return aliases.reduce((newProps, alias) => {
    checkAliasDuplicates({ model, props, attrName, alias });

    const aliasAttr = cloneDeep(attr);
    aliasAttr.aliasOf = attrName;
    delete aliasAttr.alias;

    newProps[alias] = aliasAttr;
    return newProps;
  }, {});
};

const checkAliasDuplicates = function ({ model, props, attrName, alias }) {
  if (model.properties[alias]) {
    const message = `Attribute '${attrName}' cannot have an alias '${alias}' because this attribute already exists`;
    throw new EngineError(message, { reason: 'IDL_VALIDATION' });
  }

  if (props[alias]) {
    const otherAttrName = props[alias].aliasOf;
    const message = `Attributes '${otherAttrName}' and '${attrName}' cannot have the same alias '${alias}'`;
    throw new EngineError(message, { reason: 'IDL_VALIDATION' });
  }
};


module.exports = {
  normalizeAliases,
};
