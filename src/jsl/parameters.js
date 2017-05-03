'use strict';


const { memoize } = require('../utilities');


// Returns { $NAME, $NOW, ... } which will become JSL functions parameter list
const getJslParameters = memoize(function ({ idl, target }) {
  const { recursive = [], raw = [] } = jslParametersList[target];
  const recursiveParams = recursive.reduce((memo, attrName) => [...memo, ...Object.keys(idl[attrName])], []);
  const allParams = [...recursiveParams, ...raw].join(', ');
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
const requestVars = ['$NOW', '$IP', '$PARAMS'];
const interfaceVars = ['$ACTION'];
const modelVars = ['$', '$$', 'User'];
const modelInputVars = [...interfaceVars, ...modelVars, '$DATA'];
const modelOutputVars = [...interfaceVars, ...modelVars, '$MODEL'];
const jslParametersList = {
  helpers: { recursive: ['helpers'], raw: helpersVars },
  variables: { recursive: ['helpers', 'variables'], raw: requestVars },
  filter: { raw: modelVars },
  modelInput: { recursive: ['helpers', 'variables'], raw: [...requestVars, ...modelInputVars] },
  modelOutput: { recursive: ['helpers', 'variables'], raw: [...requestVars, ...modelOutputVars] },
};


module.exports = {
  getJslParameters,
};
