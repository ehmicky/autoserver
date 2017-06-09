'use strict';


const { omit } = require('lodash');


/**
 * Rename attributes using IDL `alias`.
 **/
const renameAliases = function ({ idl, startupLog }) {
  const perf = startupLog.perf.start('command.renameAliases', 'middleware');
  const aliasesMap = getAliasesMap({ idl });
  perf.stop();

  return async function renameAliases(input) {
    const { args, modelName, sysArgs, log } = input;
    const perf = log.perf.start('command.renameAliases', 'middleware');

    const modelAliases = aliasesMap[modelName];

    //applyAliases({ args, sysArgs, modelAliases });

    perf.stop();
    const response = await this.next(input);

    //applyAliases({ response, modelAliases });

    return response;
  };
};

// Gets a map of models' attributes' aliases
// e.g. { modelName: { attrName: ['alias', ...], ... }, ... }
const getAliasesMap = function ({ idl: { models } }) {
  return Object.entries(models)
    .map(([modelName, { properties = {} }]) => {
      const readOnlyProps = Object.entries(properties)
        .filter(([, { alias }]) => alias)
        .map(([attrName, { alias }]) => {
          const value = alias instanceof Array ? alias : [alias];
          return { [attrName]: value };
        })
        .reduce((memo, obj) => Object.assign(memo, obj), {});
      return { [modelName]: readOnlyProps };
    })
    .reduce((memo, obj) => Object.assign(memo, obj), {});
};

const applyAliases = function ({ args, sysArgs, response, modelAliases }) {
  for (const [attrName, aliases] of Object.entries(modelAliases)) {
    applyAlias({ args, sysArgs, response, attrName, aliases });
  }
};

const applyAlias = function ({
  args = {},
  sysArgs: { current } = {},
  response,
  attrName,
  aliases,
}) {
  if (args.data) {
    const data = args.data;
    args.data = applyDataAliases({ data, current, attrName, aliases });
  }

  if (response) {
    const data = response.data;
    response.data = applyResponseAliases({ data, attrName, aliases });
  }
};

const applyResponseAliases = function ({ data, attrName, aliases }) {
  return data instanceof Array
    ? data.map(datum => applyResponseAlias({ data: datum, attrName, aliases }))
    : applyResponseAlias({ data, attrName, aliases });
};

const applyResponseAlias = function ({ data, attrName, aliases }) {
  const shouldSetAliases = Object.keys(data).includes(attrName);
  if (!shouldSetAliases) { return data; }

  const aliasObj = aliases.reduce((aliasObj, alias) => {
    return Object.assign(aliasObj, { [alias]: data[attrName] });
  }, {});

  const newData = Object.assign({}, data, aliasObj);
  return newData;
};

const applyDataAliases = function ({ data, current, attrName, aliases }) {
  return data instanceof Array
    ? data.map(datum => applyDataAliases({
      data: datum,
      current,
      attrName,
      aliases,
    }))
    : applyDataAlias({ data, current, attrName, aliases });
};

const applyDataAlias = function ({ data, current, attrName, aliases }) {
  const dataKeys = Object.keys(data);
  const shouldSetAliases = !dataKeys.includes(attrName) ||
    (current && data[attrName] === current[attrName]);

  if (shouldSetAliases) {
    const aliasName = aliases.find(alias => dataKeys.includes(alias));
    if (aliasName) {
      data[attrName] = data[aliasName];
    }
  }

  data = omit(data, aliases);

  return data;
};


module.exports = {
  renameAliases,
};
