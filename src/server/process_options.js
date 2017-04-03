'use strict';


const { readFileSync } = require('fs');

const { getIdl } = require('../idl');
const { EngineStartupError } = require('../error');


const processOptions = function (options) {
  const opts = Object.assign({}, options);
  const idl = processIdl(opts.conf);
  Object.assign(opts, { idl });
  return opts;
};

const processIdl = function (idl) {
  let idlDef;

  if (typeof idl === 'string') {
    idlDef = idlDef = readFileSync(idl, { encoding: 'utf-8' });
  } else if (typeof idl === 'object' && idl !== null) {
    idlDef = idl;
  } else {
    throw new EngineStartupError('Missing configuration file or \'conf\' option', { reason: 'MISSING_OPTION' });
  }

  const processedIdl = getIdl(idlDef);
  return processedIdl;
};


module.exports = {
  processOptions,
};
