'use strict';

const { assignArray } = require('../../../utilities');
const { EngineError } = require('../../../error');

// Get transforms order according to `using` property
const setOrder = function (type, model, { modelName }) {
  if (!model.properties) { return; }

  const props = getTransformUsing({ model, modelName });
  const order = findTransformOrder({ props, modelName });

  return { [`${type}Order`]: order };
};

// `compute` reuse the same logic as `transform`
const setTransformOrder = setOrder.bind(null, 'transform');
const setComputeOrder = setOrder.bind(null, 'compute');

// Returns array of properties having a transform, together with `using`
// properties, as [{ attrName, using: [...] }, ...]
const getTransformUsing = function ({ model: { properties }, modelName }) {
  const attributes = Object.keys(properties);

  return Object.entries(properties)
    .filter(([, { transform }]) => transform)
    .map(([attrName, { transform }]) => {
      // Merge all `using` properties
      const transformUsing = transform
        .map(({ using = [] }) => using)
        .reduce(assignArray, []);

      validateUsing({ transformUsing, attributes, modelName, attrName });

      return { attrName, using: transformUsing };
    });
};

// Make sure `using` properties point to an existing attribute
const validateUsing = function ({
  transformUsing,
  attributes,
  modelName,
  attrName,
}) {
  for (const using of transformUsing) {
    if (!attributes.includes(using)) {
      const message = `'using' property is invalid in model '${modelName}': attribute '${using}' does not exist`;
      throw new EngineError(message, { reason: 'IDL_VALIDATION' });
    }

    if (using === attrName) {
      const message = `'using' property is invalid in model '${modelName}': '${using}' refers to current attribute`;
      throw new EngineError(message, { reason: 'IDL_VALIDATION' });
    }
  }
};

// Returns order in which transforms should be applied, according to `using`
// Returned as an array of attribute names
const findTransformOrder = function ({ props, modelName, triedProps = [] }) {
  checkTransformCircular({ props, modelName, triedProps });

  for (const [index, prop] of props.entries()) {
    const nextProps = props.slice(index + 1);
    // Means the attribute is currently behind another attribute that should be
    // behind
    const isWrongOrder = prop.using.some(orderAttr =>
      nextProps.some(({ attrName }) => attrName === orderAttr)
    );

    if (isWrongOrder) {
      // Push the current attribute to the end of the array, and try again
      const previousProps = props.slice(0, index);
      const newProps = [...previousProps, ...nextProps, prop];
      return findTransformOrder({ props: newProps, modelName, triedProps });
    }
  }

  const transformOrder = props.map(({ attrName }) => attrName);
  return transformOrder;
};

// If two properties point to each other with `using` property, it means
// each must be before the other, which is invalid, and will throw
// exceptions during `getTransformOrder()`
const checkTransformCircular = function ({ props, modelName, triedProps }) {
  const strProps = props.map(({ attrName }) => attrName).join(',');

  if (triedProps.includes(strProps)) {
    const message = `Circular dependencies in 'using' properties of model '${modelName}'`;
    throw new EngineError(message, { reason: 'IDL_VALIDATION' });
  }

  triedProps.push(strProps);
};

module.exports = {
  setTransformOrder,
  setComputeOrder,
};
