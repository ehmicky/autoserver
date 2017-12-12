'use strict';

const {
  omit,
  omitBy,
  recurseMap,
  fullRecurseMap,
  transtype,
} = require('../utilities');
const { throwError } = require('../error');

const { availableInstructions } = require('./available');

// Process options after parsing
const processOpts = function ({ opts }) {
  const {
    // Positional arguments
    // eslint-disable-next-line id-length
    _: posArgs,
    ...optsA
  // Remove parser-specific values
  } = omit(opts, parserOpts);

  const { instruction, posArgs: posArgsA } = getInstruction({ posArgs });

  const posOpts = parsePosOpts({ instruction, posArgs: posArgsA });
  const optsB = { ...optsA, ...posOpts };

  const optsC = transtypeValues({ opts: optsB });
  const optsD = parseArrays({ opts: optsC });
  const optsE = omitBy(optsD, value => value === undefined);

  return { instruction, opts: optsE };
};

const parserOpts = ['$0', 'help', 'version', 'instruction'];

// When using default command, `config` will be the first argument
const getInstruction = function ({
  posArgs = [],
  posArgs: [instruction, ...posArgsA] = [],
}) {
  const validInstruction = availableInstructions
    .some(({ name }) => name === instruction);

  if (validInstruction) {
    return { instruction, posArgs: posArgsA };
  }

  return { instruction: 'run', posArgs };
};

// Parse positional arguments into instruction-specific options
const parsePosOpts = function ({ instruction, posArgs }) {
  const { args = [] } = availableInstructions
    .find(({ name }) => name === instruction);
  const argsA = args.filter(({ helpOnly }) => !helpOnly);
  const opts = posArgs
    .map((posArg, index) => parsePosOpt({ posArg, arg: argsA[index] }));
  const optsA = Object.assign({}, ...opts);
  return optsA;
};

const parsePosOpt = function ({ posArg, arg: { name } = {} }) {
  if (name === undefined) {
    const message = `Positional option '${posArg}' is unknown`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }

  return { [name]: posArg };
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
