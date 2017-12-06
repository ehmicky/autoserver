'use strict';

const { omit } = require('../../../utilities');
const { extractSimpleIds } = require('../../../filter');

// Fire the actual command
const fireReadCommand = async function ({
  action: { commandpath, clientCommandpath, collname, clientCollname },
  mInput,
  nextLayer,
  args,
}) {
  const emptyCommand = isEmptyCommand({ args });
  if (emptyCommand) { return []; }

  const argsA = omit(args, 'data');

  const mInputA = {
    ...mInput,
    commandpath: commandpath.join('.'),
    clientCommandpath: clientCommandpath.join('.'),
    collname,
    clientCollname,
    args: argsA,
    command: 'find',
  };

  const { data, metadata } = await getResponse({ nextLayer, mInput: mInputA });

  const resultsA = data.map(model => ({ model, metadata }));
  return resultsA;
};

// When parent value is not defined, directly returns empty value
const isEmptyCommand = function ({ args }) {
  const ids = extractSimpleIds(args);
  return Array.isArray(ids) && ids.length === 0;
};

// Fire `request`, `database` and `response` layers serially
const getResponse = async function ({ nextLayer, mInput }) {
  const mInputA = nextLayer(mInput, 'request');

  const { response } = await nextLayer(mInputA, 'database');
  const mInputB = { ...mInputA, response };

  const { response: responseA } = await nextLayer(mInputB, 'response');
  return responseA;
};

module.exports = {
  fireReadCommand,
};
