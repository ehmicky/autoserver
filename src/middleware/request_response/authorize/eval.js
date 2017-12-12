'use strict';

const { throwCommonError } = require('../../../error');
const { evalFilter, mapNodes } = require('../../../filter');

const { handleConfigFuncs } = require('./functions');

// Evaluate `coll.authorize` filter to a boolean
// Do a partial evaluation, because we do not know the value of `model.*` yet
// Returns partial filter if any.
const evalAuthorize = function ({
  collname,
  clientCollname,
  authorize,
  top,
  serverParams,
  config,
  mInput,
}) {
  const { authorize: authorizeA, params } = handleConfigFuncs({
    collname,
    authorize,
    serverParams,
    config,
    mInput,
  });

  const authorizeB = evalFilter({
    filter: authorizeA,
    attrs: params,
    partialNames: PARTIAL_NAMES_REGEXP,
  });

  checkAuthorize({ clientCollname, authorize: authorizeB, top });

  if (authorizeB === true) { return authorizeB; }

  const authorizeC = mapNodes(authorizeB, removePrefix);
  return authorizeC;
};

// Throw error if authorization filter evaluated to false.
const checkAuthorize = function ({ clientCollname, authorize, top }) {
  if (authorize) { return; }

  throwCommonError({ reason: 'AUTHORIZATION', clientCollname, top });
};

// Remove `model.` prefix in AST's `attrName`
const removePrefix = function ({ attrName, ...node }) {
  if (attrName === undefined) { return node; }

  const attrNameA = attrName.replace(PARTIAL_NAMES_REGEXP, '');
  return { ...node, attrName: attrNameA };
};

// `model.*` is transformed to `authorize`, which is added to
// `args.filter` and checked against `args.data`
const PARTIAL_NAMES_REGEXP = /^model\./;

module.exports = {
  evalAuthorize,
};
