'use strict';

const { assignArray } = require('../../../../utilities');
const { throwError } = require('../../../../error');

// Get transforms order according to `using` property
const setOrder = function (type, model, { modelName }) {
  if (!model.attributes) { return model; }

  const attrs = getAllTransformUsing({ model, modelName });
  const order = findTransformOrder({ attrs, modelName });

  return { ...model, [`${type}Order`]: order };
};

// `compute` reuse the same logic as `transform`
const setTransformOrder = setOrder.bind(null, 'transform');
const setComputeOrder = setOrder.bind(null, 'compute');

// Returns array of attributes having a transform, together with `using`
// properties, as [{ attrName, using: [...] }, ...]
const getAllTransformUsing = function ({ model: { attributes }, modelName }) {
  const attrNames = Object.keys(attributes);

  return Object.entries(attributes)
    .filter(([, { transform }]) => transform)
    .map(([attrName, { transform }]) => {
      const using = getUsing({ attrName, transform, attrNames, modelName });
      return { attrName, using };
    });
};

const getUsing = function ({ transform, ...rest }) {
  // Merge all `using` properties
  const transformUsing = transform
    .map(({ using = [] }) => using)
    .reduce(assignArray, []);

  return validateUsing({ transformUsing, ...rest });
};

// Make sure `using` properties point to an existing attribute
const validateUsing = function ({
  transformUsing,
  attrNames,
  modelName,
  attrName,
}) {
  return transformUsing.map(
    using => validateOneUsing({ using, attrNames, modelName, attrName }),
  );
};

const validateOneUsing = function ({ using, attrNames, modelName, attrName }) {
  if (!attrNames.includes(using)) {
    const message = `'using' property is invalid in model '${modelName}': attribute '${using}' does not exist`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  if (using === attrName) {
    const message = `'using' property is invalid in model '${modelName}': '${using}' refers to current attribute`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  return using;
};

// Returns order in which transforms should be applied, according to `using`
// Returned as an array of attribute names
const findTransformOrder = function ({ attrs, modelName, triedAttrs = [] }) {
  checkTransformCircular({ attrs, modelName, triedAttrs });

  const recTransformOrder = attrs.find((attr, index) =>
    findRecTransformOrder({ attrs, modelName, triedAttrs, index, attr })
  );
  if (recTransformOrder) { return recTransformOrder; }

  const transformOrder = attrs.map(({ attrName }) => attrName);
  return transformOrder;
};

const findRecTransformOrder = function ({
  attrs,
  modelName,
  triedAttrs,
  index,
  attr,
}) {
  const nextAttrs = attrs.slice(index + 1);
  // Means the attribute is currently behind another attribute that should be
  // behind
  const isWrongOrder = attr.using.some(
    orderAttr => isSameAttr({ nextAttrs, orderAttr }),
  );

  if (!isWrongOrder) { return; }

  // Push the current attribute to the end of the array, and try again
  const previousAttrs = attrs.slice(0, index);
  const attrsA = [...previousAttrs, ...nextAttrs, attr];
  return findTransformOrder({ attrs: attrsA, modelName, triedAttrs });
};

const isSameAttr = function ({ nextAttrs, orderAttr }) {
  return nextAttrs.some(({ attrName }) => attrName === orderAttr);
};

// If two attributes point to each other with `using` property, it means
// each must be before the other, which is invalid, and will throw
// exceptions during `getTransformOrder()`
const checkTransformCircular = function ({ attrs, modelName, triedAttrs }) {
  const strAttrs = attrs.map(({ attrName }) => attrName).join(',');

  if (triedAttrs.includes(strAttrs)) {
    const message = `Circular dependencies in 'using' properties of model '${modelName}'`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  // eslint-disable-next-line fp/no-mutating-methods
  triedAttrs.push(strAttrs);
};

module.exports = {
  setTransformOrder,
  setComputeOrder,
};
