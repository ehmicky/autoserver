'use strict';

const { mapValues, assignArray } = require('../../utilities');
const { EngineError } = require('../../error');

// Transforms can take several shapes, we normalize them
// We also define transform order, with `using` property
const normalizeAllTransforms = function ({ models }) {
  return mapValues(models, (model, modelName) => {
    if (!model.properties) { return model; }

    // `compute` reuse the same logic as `transform`
    for (const type of ['transform', 'compute']) {
      model.properties = mapValues(model.properties, prop => {
        const transform = prop[type];
        if (!transform) { return prop; }

        prop[type] = normalizeTransforms({ transform });

        // Using `compute` implies `readOnly` true
        if (type === 'compute') {
          prop.readOnly = true;
        }

        return prop;
      });

      model[`${type}Order`] = getTransformOrder({ model, modelName });
    }

    return model;
  });
};

// Transforms can be either an array or not
const normalizeTransforms = function ({ transform }) {
  const transforms = Array.isArray(transform) ? transform : [transform];
  return transforms.map(transform => normalizeTransform({ transform }));
};

// Transforms can be an option object, or the `value` option directly
const normalizeTransform = function ({ transform }) {
  const hasOptions = transform &&
    transform.constructor === Object &&
    transform.value !== undefined;

  if (hasOptions) {
    if (transform.using && !Array.isArray(transform.using)) {
      transform.using = [transform.using];
    }

    return transform;
  }

  return { value: transform };
};

// Get transforms order according to `using` property
const getTransformOrder = function ({ model, modelName }) {
  const props = getTransformUsing({ model, modelName });
  return findTransformOrder({ props, modelName });
};

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

      // Make sure `using` properties point to an existing attribute
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

      return { attrName, using: transformUsing };
    });
};

// Returns order in which transforms should be applied, according to `using`
// Returned as an array of attribute names
const findTransformOrder = function ({ props, modelName, triedProps = [] }) {
  checkTransformCircular({ props, modelName, triedProps });

  for (const [index, prop] of props.entries()) {
    const nextProps = props.slice(index + 1);
    // Means the attribute is currently behind another attribute that should be
    // behind
    const isWrongOrder = prop.using.some(orderAttr => {
      return nextProps.some(({ attrName }) => attrName === orderAttr);
    });

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
  normalizeAllTransforms,
};
