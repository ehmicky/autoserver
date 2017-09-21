'use strict';

const { omit } = require('../../../utilities');

// `compute` attributes are removed from input
const handleComputesIn = function ({
  args,
  args: { newData },
  modelName,
  idl: { shortcuts: { computesMap } },
}) {
  const attrs = Object.keys(computesMap[modelName]);

  if (!newData || attrs.length === 0) { return; }

  const newDataA = newData.map(newDatum => omit(newDatum, attrs));

  return { args: { ...args, newData: newDataA } };
};

module.exports = {
  handleComputesIn,
};
