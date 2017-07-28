'use strict';

const { pick } = require('../../../utilities');
const { runJsl } = require('../../../jsl');

// Performs transformation on data array or single data
const applyTransformsOnData = function ({ data, ...rest }) {
  return Array.isArray(data)
    ? data.map(datum =>
      applyAllTransforms({ data: datum, ...rest }))
    : applyAllTransforms({ data, ...rest });
};

// There can be transform for each attribute
const applyAllTransforms = function ({ data, transforms, ...rest }) {
  return transforms.reduce(
    (dataA, { attrName, transform: transA }) =>
      applyTransforms({ data: dataA, transforms: transA, ...rest, attrName }),
    data,
  );
};

// There can be several transforms per attribute
const applyTransforms = function ({ data, transforms, ...rest }) {
  return transforms.reduce(
    (dataA, transform) => applyTransform({ data: dataA, transform, ...rest }),
    data,
  );
};

const applyTransform = function ({
  data,
  attrName,
  transform: { value: transformer, test: testFunc, using },
  jsl,
  idl,
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
    runJsl({ jsl, value: testFunc, params, idl });
  if (!shouldPerform) { return data; }

  const valueA = runJsl({ jsl, value: transformer, params, idl });

  return { ...data, [attrName]: valueA };
};

module.exports = {
  applyTransformsOnData,
};
