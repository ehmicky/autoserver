'use strict';


const { uniq } = require('lodash');

const { memoize } = require('../utilities');


// Returns { $NAME, $NOW, ... } which will become JSL functions parameter list
const getJslParameters = memoize(function ({ idl, target }) {
  const { recursive = [], raw = [] } = jslParametersList[target];
  const recursiveParams = recursive.reduce((memo, attrName) => [...memo, ...Object.keys(idl[attrName])], []);
  const allParams = uniq([...recursiveParams, ...raw]).join(', ');
  const paramsList = `{ ${allParams} }`;
  return paramsList;
});

/**
 * List of possible parameters to use in JSL
 * The key is the "target". E.g. helpers have "helpers" target, model attributes like "transform" have "model" target.
 * Different targets get different parameters list
 * Raw parameters are added as is. Recursive ones look inside IDL definition, e.g. "helpers" look for possible helpers
 * in IDL.helpers.*
 **/
const baseHelpers = ['helpers', 'variables'];
const helpersVars = ['$1', '$2', '$3', '$4', '$5', '$6', '$7', '$8', '$9'];
const validationVars = ['$', '$$', '$EXPECTED'];
const requestVars = ['$NOW', '$IP', '$PARAMS'];
const interfaceVars = ['$ACTION'];
const filterVars = ['$$'];
const modelVars = [...filterVars, '$'];
const modelInputVars = [...modelVars, '$DATA'];
const modelOutputVars = [...modelVars, '$MODEL'];
const jslParametersList = {
  helpers: { recursive: baseHelpers, raw: [...requestVars, ...helpersVars] },
  variables: { recursive: baseHelpers, raw: requestVars },
  filter: { raw: filterVars },
  validation: { recursive: baseHelpers, raw: [...requestVars, ...interfaceVars, ...modelInputVars, ...validationVars] },
  modelInput: { recursive: baseHelpers, raw: [...requestVars, ...interfaceVars, ...modelInputVars] },
  modelOutput: { recursive: baseHelpers, raw: [...requestVars, ...interfaceVars, ...modelOutputVars] },
};


module.exports = {
  getJslParameters,
};
