'use strict';

const { pWriteFile } = require('../../utilities');
const { addGenErrorHandler } = require('../../error');
const { stringifyWithJsonRefs } = require('../../ref_parser');

// Saves the file
const persistFile = async function ({ cIdl, compileOpts: { idl } }) {
  const pIdl = stringifyWithJsonRefs(cIdl);
  const pPath = idl.replace(/\.[^.]+$/, '.compiled.json');
  await eWriteFile({ pPath, pIdl });

  return { pPath };
};

const writeFile = function ({ pPath, pIdl }) {
  return pWriteFile(pPath, pIdl, { encoding: 'utf-8' });
};

const eWriteFile = addGenErrorHandler(writeFile, {
  message: 'Could not write the compiled IDL file to the filesystem',
  reason: 'UTILITY_ERROR',
});

module.exports = {
  persistFile,
};
