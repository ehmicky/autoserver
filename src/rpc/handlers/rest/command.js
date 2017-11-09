'use strict';

const { singular, plural } = require('pluralize');

// Retrieve command name using the protocol method and the URL's model name
const getCommandName = function ({ method, modelname, args }) {
  const { command, isPlural } = METHODS_MAP[method];

  const modelnameA = isPlural(args) ? plural(modelname) : singular(modelname);

  return `${command}_${modelnameA}`;
};

const hasNoId = ({ id }) => id === undefined;
const hasDataArray = ({ data }) => Array.isArray(data);

const METHODS_MAP = {
  GET: { command: 'find', isPlural: hasNoId },
  HEAD: { command: 'find', isPlural: hasNoId },
  POST: { command: 'create', isPlural: hasDataArray },
  PUT: { command: 'upsert', isPlural: hasDataArray },
  PATCH: { command: 'patch', isPlural: hasNoId },
  DELETE: { command: 'delete', isPlural: hasNoId },
};

module.exports = {
  getCommandName,
};
