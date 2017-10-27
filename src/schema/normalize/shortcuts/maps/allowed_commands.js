'use strict';

const { uniq } = require('lodash');

const { assignArray } = require('../../../../utilities');
const { COMMAND_TYPES } = require('../../../../constants');
const { getEnum } = require('../../../../database');

// Guess for each model which commands are allowed, by inspecting
// `model.authorize` `$command`
// e.g. { modelName: ['find', 'replace'], ... }
const mapAttrs = function (attributes, { model: { authorize } }) {
  if (authorize === undefined) { return COMMAND_TYPES; }

  return authorize.type === 'or'
    ? getAlternatives(authorize)
    : getAllowed(authorize);
};

// Top-level `model.authorize` array, i.e. alternative
const getAlternatives = function ({ value }) {
  const commands = value
    .map(getAllowed)
    .reduce(assignArray, []);
  const commandsA = uniq(commands);
  return commandsA;
};

const getAllowed = function (node) {
  const { type, value } = node;

  const nodes = type === 'and' ? value : [node];
  const operations = nodes.filter(({ attrName }) => attrName === '$command');

  // `$command` is absent
  if (operations.length === 0) { return COMMAND_TYPES; }

  const commands = getEnum({ operations, possVals: COMMAND_TYPES });
  return commands;
};

const allowedCommandsMap = { mapAttrs };

module.exports = {
  allowedCommandsMap,
};
