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
  const perf = startupLog.perf.start('command.handleReadOnly', 'middleware');
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
// e.g. { my_model: { attr: transform ... }, ... }
const getTransformsMap = function ({ idl: { models } }) {
  return Object.entries(models)
    .map(([modelName, { properties = {} }]) => {
      const props = Object.entries(properties)
        .filter(([, { transform }]) => transform)
        .map(([attrName, { transform }]) => {
          const normalizedTransform = normalizeTransforms({ transform });
          return { [attrName]: normalizedTransform };
        })
        .reduce((memo, obj) => Object.assign(memo, obj), {});
      return { [modelName]: props };
    })
    .reduce((memo, obj) => Object.assign(memo, obj), {});
};

const applyTransforms = function ({ data, transforms, jsl }) {
  // Value should be an object if valid, but it might be invalid
  // since the validation layer is not fired yet on input
  if (!data || data.constructor !== Object) { return data; }

  for (const [attrName, allTransform] of Object.entries(transforms)) {
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
  if (hasOptions) { return transform; }

  return { value: transform };
};


module.exports = {
  handleTransforms,
};
