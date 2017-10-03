'use strict';

const { mapValues } = require('../../../utilities');

const { validateData, isModelType } = require('./validate');
const { isModel } = require('./nested');

// Validates `args.data` and adds default ids.
const parseData = function ({ data, ...rest }) {
  return Array.isArray(data)
    ? data.map((datum, index) => parseDatum({ datum, index, ...rest }))
    : parseDatum({ datum: data, ...rest });
};

const parseDatum = function ({ datum, index, commandPath, top, modelsMap }) {
  const commandPathA = index === undefined
    ? commandPath
    : [...commandPath, index];

  validateData({ datum, commandPath: commandPathA, top });

  return mapValues(
    datum,
    (obj, attrName) => parseAttr({
      obj,
      index,
      attrName,
      commandPath: commandPathA,
      top,
      modelsMap,
    }),
  );
};

// Recursion over nested models
const parseAttr = function ({
  obj,
  index,
  attrName,
  commandPath,
  top,
  modelsMap,
}) {
  const isNested = isModelType(obj) &&
    isModel({ attrName, commandPath, top, modelsMap });
  if (!isNested) { return obj; }

  const commandPathA = index === undefined
    ? [...commandPath, attrName]
    : [...commandPath, index, attrName];
  return parseData({ data: obj, commandPath: commandPathA, top, modelsMap });
};

module.exports = {
  parseData,
};
