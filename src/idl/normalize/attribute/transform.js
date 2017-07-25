'use strict';

// Transforms can take several shapes, we normalize them
// We also define transform order, with `using` property
const normalizeTransforms = function (type, attr) {
  const transform = attr[type];
  if (!transform) { return; }

  const value = normalizeValues({ transform });

  // Using `compute` implies `readOnly` true
  const readOnly = type === 'compute' ? true : attr.readOnly;
  attr.readOnly = readOnly;

  return { [type]: value, readOnly };
};

// `compute` reuse the same logic as `transform`
const normalizeTransform = normalizeTransforms.bind(null, 'transform');
const normalizeCompute = normalizeTransforms.bind(null, 'compute');

// Transforms can be either an array or not
const normalizeValues = function ({ transform }) {
  const transforms = Array.isArray(transform) ? transform : [transform];
  return transforms.map(func => normalizeValue({ transform: func }));
};

// Transforms can be an option object, or the `value` option directly
const normalizeValue = function ({ transform }) {
  const hasOptions = transform &&
    transform.constructor === Object &&
    transform.value !== undefined;
  const options = hasOptions ? transform : { value: transform };

  if (options.using && !Array.isArray(options.using)) {
    const using = [options.using];
    return Object.assign({}, options, { using });
  }

  return options;
};

module.exports = {
  normalizeTransform,
  normalizeCompute,
};
