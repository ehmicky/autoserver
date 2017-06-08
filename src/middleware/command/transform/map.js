'use strict';


// Gets a map of models' transforms
// e.g. { my_model: [{ attrName, transform }, ...], ... }
const getTransformsMap = function ({ idl: { models } }) {
  return Object.entries(models)
    .map(([modelName, { transformOrder, properties = {} }]) => {
      const props = Object.entries(properties)
        .filter(([, { transform }]) => transform)
        .map(([attrName, { transform }]) => ({ attrName, transform }));
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
