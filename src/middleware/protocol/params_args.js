'use strict';

const { underscored } = require('underscore.string');

const { transtype, pickBy, mapKeys, mapValues } = require('../../utilities');

// Parse `args.params` specified as protocol header
const parseParamsArg = function ({ headers }) {
  const paramsArg = parseHeaders({ headers });
  return { paramsArg };
};

const parseHeaders = function ({ headers }) {
  const headersA = pickBy(
    headers,
    (header, name) => PARAMS_HEADER_REGEXP.test(name),
  );
  const headersB = mapKeys(headersA, (header, name) => renameHeader({ name }));
  const paramsArg = mapValues(headersB, transtype);
  return paramsArg;
};

const PARAMS_HEADER_REGEXP = /^(X-Api-Engine-Param-)([a-zA-Z0-9-]+)$/;

const renameHeader = function ({ name }) {
  const nameA = name.replace(PARAMS_HEADER_REGEXP, '$2');
  const nameB = underscored(nameA);
  return nameB;
};

module.exports = {
  parseParamsArg,
};
