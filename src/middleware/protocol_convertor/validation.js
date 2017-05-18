'use strict';


const { validate } = require('../../validation');


/**
 * Protocol layer validation
 * Those errors should not happen, i.e. server-side (e.g. 500)
 **/
const protocolValidation = function ({ input }) {
  validate({ schema, data: input, reportInfo });
};

const schema = {
  required: ['protocol'],
  properties: {
    protocol: { type: 'object' },
  },
};
const reportInfo = { type: 'serverInputSyntax', dataVar: 'input' };


module.exports = {
  protocolValidation,
};
