'use strict';


// Gets a map of models' attributes' aliases
// e.g. { modelName: { attrName: ['alias', ...], ... }, ... }
const getAliasesMap = function ({ idl: { models } }) {
  return Object.entries(models)
    .map(([modelName, { properties = {} }]) => {
      const aliasProps = Object.entries(properties)
        .filter(([, { alias }]) => alias)
        .map(([attrName, { alias }]) => {
          const value = alias instanceof Array ? alias : [alias];
          return { [attrName]: value };
        })
        .reduce((memo, obj) => Object.assign(memo, obj), {});
      return { [modelName]: aliasProps };
    })
    .reduce((memo, obj) => Object.assign(memo, obj), {});
};


module.exports = {
  getAliasesMap,
};
