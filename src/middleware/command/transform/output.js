'use strict';

const { transformData } = require('./transformer');

// Handles `attr.compute`
const handleComputes = function ({
  response,
  response: { data },
  idl,
  modelName,
  ifv,
}) {
  if (!data) { return; }

  const dataA = transformData({ data, idl, modelName, ifv, type: 'compute' });

  const responseA = { ...response, data: dataA };
  return { response: responseA };
};

module.exports = {
  handleComputes,
};
