'use strict';

const { underscored } = require('underscore.string');

const { transtype, pickBy, mapKeys, mapValues } = require('../../utilities');

// Parse `args.params` specified as protocol header
const parseParamsArg = function ({ requestHeaders }) {
  const paramsArg = parseHeaders({ requestHeaders });
  return { paramsArg };
};

const parseHeaders = function ({ requestHeaders }) {
  const headers = pickBy(
    requestHeaders,
    (header, name) => PARAMS_HEADER_REGEXP.test(name),
  );
  const headersA = mapKeys(headers, (header, name) => renameHeader({ name }));
  const paramsArg = mapValues(headersA, transtype);
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
