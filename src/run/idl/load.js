'use strict';

const { isEqual } = require('lodash');

const { pWriteFile } = require('../../utilities');
const { getIdl } = require('../../idl');
const { dereferenceIdl, stringifyWithJsonRefs } = require('../../ref_parser');

const loadIdl = async function ({ runOpts: { idl } }) {
  const compiledPath = await compileIdl({ rawPath: idl });
  const idlA = await loadCompiledIdl({ compiledPath });
  return { idl: idlA };
};

const compileIdl = async function ({ rawPath }) {
  const rawIdl = await loadRawIdl({ rawPath });

  const compiledIdl = stringifyWithJsonRefs(rawIdl);
  const compiledPath = rawPath.replace(/\.[^.]+$/, '.compiled.json');
  await pWriteFile(compiledPath, compiledIdl, { encoding: 'utf-8' });

  validateCompiledIdl({ compiledPath, rawIdl });

  return compiledPath;
};

const validateCompiledIdl = async function ({ compiledPath, rawIdl }) {
  const compiledIdl = await loadCompiledIdl({ compiledPath });

  console.log('Verif', isEqual(rawIdl, compiledIdl));
};

const loadRawIdl = async function ({ rawPath }) {
  const rawIdl = await getIdl({ path: rawPath });
  return rawIdl;
};

const loadCompiledIdl = function ({ compiledPath }) {
  return dereferenceIdl({ path: compiledPath });
};

module.exports = {
  loadIdl,
};
