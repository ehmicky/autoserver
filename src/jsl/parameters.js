'use strict';


const { memoize } = require('../utilities');


// Top-level attributes that can contain JSL
const jslTopLevelAttributes = ['helpers', 'variables'];
// These attributes might contain JSL
const jslModelInputAttributes = ['default', 'transform', 'compute'];
const jslModelOutputAttributes = ['defaultOut', 'transformOut', 'computeOut'];

// Returns { $name, $now, ... } which will become JSL functions parameter list
const getJslParameters = memoize(function ({ idl, target }) {
  const params = jslParametersList[target];
  const recursiveParams = params.recursive.reduce((memo, attrName) => [...memo, ...Object.keys(idl[attrName])], []) || [];
  const rawParams = params.raw || [];
  const allParams = [...recursiveParams, ...rawParams].join(', ');
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
const helpersVars = ['$1', '$2', '$3', '$4', '$5', '$6', '$7', '$8', '$9'];
const requestVars = ['$now', '$ip', '$params'];
const modelVars = ['$action', '$', '$$', 'User'];
const modelInputVars = [...modelVars, '$data'];
const modelOutputVars = [...modelVars, '$model'];
const jslParametersList = {
  helpers: { recursive: ['helpers'], raw: [...requestVars, ...helpersVars] },
  variables: { recursive: ['helpers', 'variables'], raw: requestVars },
  modelInput: { recursive: ['helpers', 'variables'], raw: [...requestVars, ...modelInputVars] },
  modelOutput: { recursive: ['helpers', 'variables'], raw: [...requestVars, ...modelOutputVars] },
};


module.exports = {
  jslTopLevelAttributes,
  jslModelInputAttributes,
  jslModelOutputAttributes,
  getJslParameters,
};
