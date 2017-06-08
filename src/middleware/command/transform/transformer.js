'use strict';


// Performs transformation on arg.data
const applyTransforms = function ({ data, transforms, jsl }) {
  // Value should be an object if valid, but it might be invalid
  // since the validation layer is not fired yet on input
  if (!data || data.constructor !== Object) { return data; }

  // There can be transform for each attribute
  for (const { attrName, transform: allTransform } of transforms) {
    // There can be several transforms per attribute
    for (const transform of allTransform) {
      applyTransform({ data, attrName, transform, jsl });
    }
  }

  return data;
};

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
  applyTransforms,
};
