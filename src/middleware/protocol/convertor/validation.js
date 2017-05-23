'use strict';


const { validate } = require('../../../validation');


/**
 * Protocol layer validation
 * Those errors should not happen, i.e. server-side (e.g. 500)
 **/
const protocolValidation = function ({ input }) {
  validate({ schema, data: input, reportInfo });
};

const schema = {
  type: 'object',
  required: ['specific', 'jsl'],
  properties: {
    specific: { type: 'object' },
    jsl: { type: 'object' },
  },
};
const reportInfo = { type: 'serverInputSyntax', dataVar: 'input' };


module.exports = {
  protocolValidation,
};
