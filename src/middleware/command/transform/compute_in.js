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

  const newDataA = getNewData({ newData, attrs });

  return { args: { ...args, newData: newDataA } };
};

const getNewData = function ({ newData, attrs }) {
  if (Array.isArray(newData)) {
    return newData.map(
      newDatum => getNewData({ newData: newDatum, attrs }),
    );
  }

  return omit(newData, attrs);
};

module.exports = {
  handleComputesIn,
};
