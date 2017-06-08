'use strict';


/**
 * Applies schema `transform`
 * Those are mapping functions applies on input for a particular attribute.
 * They can be any static value or JSL.
 * Note: transforms do not have to be idempotent.
 * Transforms format:
 *   - value {any} - same as { value: value }
 *   - options {object}:
 *      - value {(jsl|any)} - value to transform to.
 *        Can use JSL, including $ and $$.
 **/
const handleTransforms = function ({ idl, startupLog }) {
  const perf = startupLog.perf.start('command.handleTransforms', 'middleware');
  const transformsMap = getTransformsMap({ idl });
  perf.stop();

  return async function handleTransforms(input) {
    const { args, modelName, log, jsl } = input;
    const { data } = args;
    const perf = log.perf.start('command.handleTransforms', 'middleware');

    // Remove readonly attributes in `args.data`
    if (data) {
      const transforms = transformsMap[modelName];
      args.data = data instanceof Array
        ? data.map(datum => applyTransforms({ data: datum, transforms, jsl }))
        : applyTransforms({ data, transforms, jsl });
    }

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

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

const applyTransforms = function ({ data, transforms, jsl }) {
  // Value should be an object if valid, but it might be invalid
  // since the validation layer is not fired yet on input
  if (!data || data.constructor !== Object) { return data; }

  for (const { attrName, transform: allTransform } of transforms) {
    for (const transform of allTransform) {
      applyTransform({ data, attrName, transform, jsl });
    }
  }

  return data;
};

// Performs actual substitution
const applyTransform = function ({
  data,
  attrName,
  transform: { value: transformer, test },
  jsl,
}) {
  // Each successive transform will modify the next transform's $$ and $
  const params = { $$: data, $: data[attrName] };

  // Can add a `test` function
  const shouldPerform = test === undefined || jsl.run({ value: test, params });
  if (!shouldPerform) { return; }

  let newValue = jsl.run({ value: transformer, params });

  // `undefined` means a value has never been set, i.e. can only set `null`
  /*
  if (newValue === undefined) {
    newValue = null;
  }
  */

  data[attrName] = newValue;
};


module.exports = {
  handleTransforms,
};
