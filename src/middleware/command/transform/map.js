'use strict';


// Gets a map of models' `transform` or `compute`
// e.g. { my_model: [{ attrName, transform }, ...], ... }
const getTransformsMap = function ({ idl: { models }, type }) {
  return Object.entries(models)
    .map(([modelName, { transformOrder, properties = {} }]) => {
      const props = Object.entries(properties)
        .filter(([, prop]) => prop[type])
        .map(([attrName, prop]) => ({ attrName, transform: prop[type] }));
      const sortedProps = sortProps({ props, transformOrder });
      return { [modelName]: sortedProps };
    })
    .reduce((memo, obj) => Object.assign(memo, obj), {});
};

// Sort transforms according to `using` property
const sortProps = function ({ props, transformOrder }) {
  return props.sort((a, b) => {
    const indexA = transformOrder.indexOf(a.attrName);
    const indexB = transformOrder.indexOf(b.attrName);
    return indexA > indexB ? 1 : indexA < indexB ? -1 : 0;
  });
};


module.exports = {
  getTransformsMap,
};
