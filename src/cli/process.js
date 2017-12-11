'use strict';

const { omit, recurseMap, fullRecurseMap, transtype } = require('../utilities');

const availableInstructions = require('./available');

// Process options after parsing
const processOpts = function ({ opts }) {
  const {
    // Positional arguments
    // eslint-disable-next-line id-length
    _: [instruction, config] = [],
    ...optsA
  // Remove parser-specific values
  } = omit(opts, parserOpts);

  const {
    instruction: instructionA = 'run',
    config: configA,
  } = getInstruction({ instruction, config });

  const optsB = transtypeValues({ opts: optsA });
  const optsC = parseArrays({ opts: optsB });
  const optsD = { ...optsC, config: configA };

  return { opts: optsD, instruction: instructionA };
};

const parserOpts = ['$0', 'help', 'version'];

// When using default command, `config` will be the first argument
const getInstruction = function ({ instruction, config }) {
  const validInstruction = availableInstructions
    .some(({ name }) => name === instruction);

  if (validInstruction) {
    return { instruction, config };
  }

  return { config: instruction };
};

// Allow JSON values for options
const transtypeValues = function ({ opts }) {
  return recurseMap(opts, transtype);
};

// `yargs` parses `--OPT.0` as an object `{ OPT: { 0: ... } }`
// We transform it to an array instead: `{ OPT: [...] }`
const parseArrays = function ({ opts }) {
  return fullRecurseMap(opts, parseArray);
};

const parseArray = function (value) {
  const isArray = value != null &&
    value.constructor === Object &&
    Object.keys(value).some(isIndex);
  if (!isArray) { return value; }

  const arrA = Object.entries(value).filter(([index]) => isIndex(index));

  const indexes = arrA.map(([index]) => index);
  const length = Math.max(...indexes);
  const arrB = new Array(length).fill();

  const arrC = arrA.reduce(addArrayValue, arrB);
  return arrC;
};

const isIndex = function (value) {
  return Number.isInteger(Number(value));
};

const addArrayValue = function (arr, [index, val]) {
  const indexA = Number(index);
  const start = arr.slice(0, indexA);
  const end = arr.slice(indexA + 1);
  return [...start, val, ...end];
};

module.exports = {
  processOpts,
};
