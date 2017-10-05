'use strict';

const { mapValues, omit } = require('../../../utilities');
const { getCommand } = require('../../../constants');
const { getModel } = require('../get_model');

const { isModelType } = require('./validate');

// Transform each `args.data` object into a separate write action
const getWriteAction = function ({
  data,
  commandPath,
  dataPaths,
  top,
  top: { command: { type: commandType, multiple } },
  modelsMap,
  nestedKeys,
}) {
  const { modelName } = getModel({ top, modelsMap, commandPath });

  // Nested actions due to nested `args.data` reuses top-level action
  const isTopLevel = commandPath.length === 1;
  // Commands are normalized to being multiple, except the top-level one
  const multipleA = isTopLevel ? multiple : true;
  const command = getCommand({ commandType, multiple: multipleA });

  const { deepKeys, data: dataA } = replaceNestedData({
    data,
    nestedKeys,
    commandType,
  });
  const args = { deepKeys, data: dataA };

  return { commandPath, args, command, modelName, dataPaths };
};

// Replace nested objects from each `args.data` by only their ids
const replaceNestedData = function ({ data, nestedKeys, commandType }) {
  const deepKeys = getAllDeepKeys({ data, nestedKeys });
  const dataA = data.map((datum, index) => replaceNestedDatum({
    datum,
    deepKeys: deepKeys[index],
    commandType,
  }));
  return { deepKeys, data: dataA };
};

// Retrieve list of attributes that contain a nested model
// I.e. in `args.data` { model: 1, other_model: { ... }, not_model: { ... } }
// `model` and `not_model` would not be included, but `other_model` would
const getAllDeepKeys = function ({ data, nestedKeys }) {
  return data.map(datum => getDeepKeys({ datum, nestedKeys }));
};

const getDeepKeys = function ({ datum, nestedKeys }) {
  return nestedKeys.filter(key =>
    isModelType(datum[key]) &&
    !(Array.isArray(datum[key]) && datum[key].length === 0)
  );
};

const replaceNestedDatum = function ({ datum, deepKeys, commandType }) {
  // Patch commands do not use ids in args.data
  if (commandType === 'patch') {
    return omit(datum, deepKeys);
  }

  const datumA = mapValues(
    datum,
    (value, key) => replaceNestedValue({ value, key, deepKeys }),
  );
  return datumA;
};

const replaceNestedValue = function ({ value, key, deepKeys }) {
  if (!(deepKeys.includes(key))) { return value; }

  return Array.isArray(value) ? value.map(({ id }) => id) : value.id;
};

module.exports = {
  getWriteAction,
};
