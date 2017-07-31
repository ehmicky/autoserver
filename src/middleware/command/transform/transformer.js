'use strict';

const { pick } = require('../../../utilities');
const { runJsl } = require('../../../jsl');

const applyInputTransforms = function ({
  input,
  input: { args, args: { newData }, modelName, jsl, idl },
  type,
}) {
  if (!newData) { return input; }

  const transforms = getTransforms({ idl, type, modelName });
  const data = newData;

  const newDataA = applyTransformsOnData({ data, transforms, jsl, idl, type });
  return { ...input, args: { ...args, newData: newDataA } };
};

const applyOutputTransforms = function ({
  input: { modelName, jsl, idl },
  response,
  response: { data },
  type,
}) {
  if (!data) { return response; }

  const transforms = getTransforms({ idl, type, modelName });

  const dataA = applyTransformsOnData({ data, transforms, jsl, idl, type });
  return { ...response, data: dataA };
};

const getTransforms = function ({
  idl: { shortcuts: { transformsMap, computesMap } },
  type,
  modelName,
}) {
  return type === 'compute' ? computesMap[modelName] : transformsMap[modelName];
};

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
  const params = getTransformParams({ data, attrName, type, using });

  // Can add a `test` function
  const shouldPerform = testFunc === undefined ||
    runJsl({ jsl, value: testFunc, params, idl });
  if (!shouldPerform) { return data; }

  const valueA = runJsl({ jsl, value: transformer, params, idl });

  return { ...data, [attrName]: valueA };
};

const getTransformParams = function ({ data, attrName, type, using }) {
  // Ensure consumers use `using` property by deleting all other properties,
  // i.e. $$.ATTRIBUTE will be undefined in transforms unless `using` is
  // specified
  const model = pick(data, using);

  // Each successive transform will modify the next transform's $$ and $
  const params = { $$: model };

  // `compute` cannot use $ in JSL, because the model is not persisted
  if (type === 'compute') { return params; }

  return { ...params, $: data[attrName] };
};

module.exports = {
  applyInputTransforms,
  applyOutputTransforms,
};
