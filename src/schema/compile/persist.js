'use strict';

const { pWriteFile } = require('../../utilities');
const { addGenErrorHandler } = require('../../error');
const { stringifyWithRefs } = require('../../ref_parser');

// Saves the file
const persistFile = async function ({ cSchema, compileOpts: { schema } }) {
  const pSchema = stringifyWithRefs(cSchema);
  const pPath = schema.replace(/\.[^.]+$/, '.compiled.json');
  await eWriteFile({ pPath, pSchema });

  return { pPath };
};

const writeFile = function ({ pPath, pSchema }) {
  return pWriteFile(pPath, pSchema, { encoding: 'utf-8' });
};

const eWriteFile = addGenErrorHandler(writeFile, {
  message: 'Could not write the compiled schema to the filesystem',
  reason: 'UTILITY_ERROR',
});

module.exports = {
  persistFile,
};
