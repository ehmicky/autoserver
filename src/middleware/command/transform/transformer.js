'use strict';

const { pick } = require('../../../utilities');

// Performs transformation on data array or single data
const applyTransformsOnData = function ({ data, transforms, jsl, type }) {
  return Array.isArray(data)
    ? data.map(datum => applyTransforms({ data: datum, transforms, jsl, type }))
    : applyTransforms({ data, transforms, jsl, type });
};

const applyTransforms = function ({ data, transforms, jsl, type }) {
  // There can be transform for each attribute
  for (const { attrName, transform: allTransform } of transforms) {
    // There can be several transforms per attribute
    for (const transform of allTransform) {
      applyTransform({ data, attrName, transform, jsl, type });
    }
  }

  return data;
};

const applyTransform = function ({
  data,
  attrName,
  transform: { value: transformer, test: testFunc, using },
  jsl,
  type,
}) {
  // Ensure consumers use `using` property by deleting all other properties,
  // i.e. $$.ATTRIBUTE will be undefined in transforms unless `using` is
  // specified
  const model = pick(data, using);

  // Each successive transform will modify the next transform's $$ and $
  const params = { $$: model };

  // `compute` cannot use $ in JSL, because the model is not persisted
  if (type !== 'compute') {
    params.$ = data[attrName];
  }

  // Can add a `test` function
  const shouldPerform = testFunc === undefined ||
    jsl.run({ value: testFunc, params });
  if (!shouldPerform) { return; }

  const newValue = jsl.run({ value: transformer, params });

  data[attrName] = newValue;
};

module.exports = {
  applyTransformsOnData,
};
