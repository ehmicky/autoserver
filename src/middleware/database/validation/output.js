'use strict';

const { validate } = require('../../../validation');
const { getDataValidationSchema } = require('./schema');

/**
 * Check that output data passes IDL validation
 * If it does not, this probably indicates database corruption
 **/
const validateOutputData = function ({
  idl,
  modelName,
  response: { data },
  action,
  command,
  jsl,
}) {
  const type = 'serverOutputData';
  const schema = getDataValidationSchema({ idl, modelName, command, type });
  data = data instanceof Array ? data : [data];
  data.forEach(datum => {
    const reportInfo = { type, modelName, action, dataVar: 'response' };
    validate({ schema, data: datum, reportInfo, extra: jsl });
  });
};

module.exports = {
  validateOutputData,
};
