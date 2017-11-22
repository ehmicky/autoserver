'use strict';

const { omit } = require('../../../utilities');

// Modify `args.newData`, or database output
const renameData = function ({ value, newIdName, oldIdName }) {
  return value.map(datum => renameDatum({ datum, newIdName, oldIdName }));
};

const renameDatum = function ({ datum, newIdName, oldIdName }) {
  const hasId = Object.keys(datum).includes(oldIdName);
  if (!hasId) { return datum; }

  const { [oldIdName]: attr } = datum;
  const datumA = omit(datum, oldIdName);
  return { ...datumA, [newIdName]: attr };
};

module.exports = {
  renameData,
};
