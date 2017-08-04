'use strict';

const { mapValues } = require('../../../../../../utilities');

const addKinds = function ({ fields, parentDef }) {
  return mapValues(fields, def => addKind({ def, parentDef }));
};

const addKind = function ({ def, parentDef }) {
  const kind = parentDef.kind === 'graphqlMethod' ? 'model' : 'attribute';
  return { ...def, kind };
};

module.exports = {
  addKinds,
};
