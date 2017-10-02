'use strict';

const { uniq } = require('lodash');

const { mapValues, assignArray, omitBy } = require('../../utilities');
const { throwError } = require('../../error');
const { getCommand } = require('../../constants');

const { getModel } = require('./get_model');

const parseDataArg = function ({
  actions,
  top,
  top: { args: { data }, commandPath },
  idl: { shortcuts: { modelsMap } },
}) {
  if (data === undefined) { return { actions }; }

  const dataPaths = getDataPath({ data, path: commandPath });
  const actionsA = parseData({ data, commandPath, dataPaths, top, modelsMap });
  const actionsB = mergeActions({
    readActions: actions,
    writeActions: actionsA,
  });
  return { actions: actionsB };
};

const parseData = function ({ data, commandPath, dataPaths, top, modelsMap }) {
  const dataA = normalizeData({ data });

  dataA.forEach(datum => validateData({ data: datum, commandPath, top }));

  const nestedKeys = getNestedKeys({ data: dataA, commandPath, top, modelsMap });
  const nestedActions = getNestedActions({
    data: dataA,
    commandPath,
    dataPaths,
    top,
    modelsMap,
    nestedKeys,
  });
  const action = getAction({
    data: dataA,
    commandPath,
    dataPaths,
    top,
    modelsMap,
    nestedKeys,
  });
  const actionA = filterAction({ action });
  return [...actionA, ...nestedActions];
};

const normalizeData = function ({ data }) {
  return Array.isArray(data) ? data : [data];
};

const validateData = function ({
  data,
  commandPath,
  top: { command: { type: commandType } },
}) {
  if (!isObject(data)) {
    const message = `'data' argument at ${commandPath.join('.')} should be an object or an array of objects, instead of: ${JSON.stringify(data)}`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  if (requiredIdTypes.includes(commandType) && data.id == null) {
    const message = `'data' argument at ${commandPath.join('.')} contains some models without an 'id' attribute`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  if (forbiddenIdTypes.includes(commandType) && data.id != null) {
    const message = `Cannot use 'id' ${data.id}: 'patch' actions cannot specify 'id' attributes in 'data' argument, because ids cannot be changed. Use 'filter' argument instead.`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }
};

const requiredIdTypes = ['replace'];
const forbiddenIdTypes = ['patch'];

const isModelType = function (val) {
  if (isObject(val)) { return true; }

  return Array.isArray(val) && val.every(isObject);
};

const isObject = function (obj) {
  return obj && obj.constructor === Object;
};

const getNestedKeys = function ({ data, commandPath, top, modelsMap }) {
  const nestedKeys = data
    .map(Object.keys)
    .reduce(assignArray, []);
  const nestedKeysA = uniq(nestedKeys);
  const nestedKeysB = nestedKeysA.filter(attrName => {
    const model = getModel({
      top,
      modelsMap,
      commandPath: [...commandPath, attrName],
    });
    return model !== undefined && model.modelName !== undefined;
  });
  return nestedKeysB;
};

const getNestedActions = function ({
  data,
  dataPaths,
  commandPath,
  top,
  modelsMap,
  nestedKeys,
}) {
  return nestedKeys
    .map(nestedKey => {
      const nestedCommandPath = [...commandPath, nestedKey];
      const nestedData = data
        .map(datum => datum[nestedKey])
        .reduce(assignArray, []);
      const nestedDataA = nestedData.filter(isObject);

      const nestedDataPaths = dataPaths
        .map((dataPath, index) => getDataPath({
          data: data[index][nestedKey],
          path: [...dataPath, nestedKey],
        }))
        .reduce(assignArray, []);

      return parseData({
        data: nestedDataA,
        commandPath: nestedCommandPath,
        dataPaths: nestedDataPaths,
        top,
        modelsMap,
      });
    })
    .reduce(assignArray, []);
};

const getDataPath = function ({ data, path }) {
  if (!isModelType(data)) { return []; }

  if (!Array.isArray(data)) { return [path]; }

  return Object.keys(data).map(ind => [...path, Number(ind)]);
};

const getAction = function ({
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
  // Others are simply for selection, i.e. are find actions
  const isTopLevel = commandPath.length === 1;
  const multipleA = isTopLevel ? multiple : true;
  const command = getCommand({ commandType, multiple: multipleA });

  const dataA = data.map(datum => mapData({ datum, nestedKeys }));
  const args = { data: dataA };

  return { commandPath, args, command, modelName, dataPaths };
};

const mapData = function ({ datum, nestedKeys }) {
  const datumA = mapValues(
    datum,
    (value, key) => mapDataValue({ value, key, nestedKeys }),
  );
  // Patch actions do not use ids in args.data,
  // i.e. will create undefined values
  const datumB = omitBy(datumA, value => value === undefined);
  return datumB;
};

const mapDataValue = function ({ value, key, nestedKeys }) {
  if (!(nestedKeys.includes(key) && isModelType(value))) { return value; }

  return Array.isArray(value) ? value.map(({ id }) => id) : value.id;
};

const filterAction = function ({ action, action: { args: { data } } }) {
  const isEmptyAction = data.length === 0;
  if (isEmptyAction) { return []; }

  return [action];
};

const mergeActions = function ({ readActions, writeActions }) {
  const writeActionsA = writeActions
    .map(writeAction => mergeAction({ readActions, writeAction }));
  const readActionsA = readActions
    .filter(readAction => readAction.commandPath.length !== 1);
  return [...writeActionsA, ...readActionsA];
};

const mergeAction = function ({ readActions, writeAction }) {
  const readAction = findAction({
    actions: readActions,
    action: writeAction,
  });
  if (!readAction) { return writeAction; }

  return {
    ...readAction,
    ...writeAction,
    args: { ...readAction.args, ...writeAction.args },
  };
};

const findAction = function ({ actions, action }) {
  return actions.find(({ commandPath }) =>
    commandPath.join('.') === action.commandPath.join('.')
  );
};

module.exports = {
  parseDataArg,
};
