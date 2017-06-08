'use strict';


const { map } = require('../../utilities');
const { EngineError } = require('../../error');


// Transforms can take several shapes, we normalize them
// We also define transform order, with `using` property
const normalizeAllTransforms = function ({ models }) {
  return map(models, (model, modelName) => {
    if (!model.properties) { return model; }

    const attributes = Object.keys(model.properties);
    const properties = map(model.properties, prop => {
      const { transform } = prop;
      if (!transform) { return prop; }

      const newTransform = normalizeTransforms({ transform });
      const transformUsing = getTransformUsing({
        modelName,
        attributes,
        transforms: newTransform,
      });
      Object.assign(prop, { transform: newTransform, transformUsing });

      return prop;
    });

    const props = Object.entries(properties)
      .filter(([, { transform }]) => transform)
      .map(([attrName, { transformUsing }]) => ({ attrName, transformUsing }));
    const transformOrder = getTransformOrder({ props, modelName });
    Object.assign(model, { properties, transformOrder });

    return model;
  });
};

// Transforms can be either an array or not
const normalizeTransforms = function ({ transform }) {
  const transforms = transform instanceof Array ? transform : [transform];
  return transforms.map(transform => normalizeTransform({ transform }));
};

// Transforms can be an option object, or the `value` option directly
const normalizeTransform = function ({ transform }) {
  const hasOptions = transform &&
    transform.constructor === Object &&
    transform.value !== undefined;
  if (hasOptions) {
    if (transform.using && !(transform.using instanceof Array)) {
      transform.using = [transform.using];
    }
    return transform;
  }

  return { value: transform };
};

// Merge all `using` properties
const getTransformUsing = function ({ modelName, attributes, transforms }) {
  const transformUsing = transforms
    .reduce((memo, { using = [] }) => [...memo, ...using], []);

  // Make sure `using` properties point to an existing attribute
  for (const using of transformUsing) {
    if (!attributes.includes(using)) {
      const message = `'using' property is invalid in model '${modelName}': attribute '${using}' does not exist`;
      throw new EngineError(message, { reason: 'IDL_VALIDATION' });
    }
  }

  return transformUsing;
};

// Get transforms order according to `using` property
const getTransformOrder = function ({ props, modelName, triedProps = [] }) {
  checkTransformCircular({ props, modelName, triedProps });

  for (const [index, prop] of props.entries()) {
    const nextProps = props.slice(index + 1);
    const isWrongOrder = prop.transformUsing.some(orderAttr => {
      return nextProps.some(({ attrName }) => attrName === orderAttr);
    });
    if (isWrongOrder) {
      const previousProps = props.slice(0, index);
      const newProps = [...previousProps, ...nextProps, prop];
      return getTransformOrder({ props: newProps, modelName, triedProps });
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
