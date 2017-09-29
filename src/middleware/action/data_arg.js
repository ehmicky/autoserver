'use strict';

const { uniq } = require('lodash');

const { mapValues, assignArray, omitBy } = require('../../utilities');
const { throwError } = require('../../error');
const { getActionConstant } = require('../../constants');

const { getModel } = require('./get_model');

const parseDataArg = function ({
  actions,
  top,
  top: { args: { data }, actionPath },
  idl: { shortcuts: { modelsMap } },
}) {
  if (data === undefined) { return { actions }; }

  const dataPaths = getDataPath({ data, path: actionPath });
  const actionsA = parseData({ data, actionPath, dataPaths, top, modelsMap });
  const actionsB = mergeActions({
    readActions: actions,
    writeActions: actionsA,
  });
  return { actions: actionsB };
};

const parseData = function ({ data, actionPath, dataPaths, top, modelsMap }) {
  const dataA = normalizeData({ data });

  dataA.forEach(datum => validateData({ data: datum, actionPath, top }));

  const nestedKeys = getNestedKeys({ data: dataA, actionPath, top, modelsMap });
  const nestedActions = getNestedActions({
    data: dataA,
    actionPath,
    dataPaths,
    top,
    modelsMap,
    nestedKeys,
  });
  const action = getAction({
    data: dataA,
    actionPath,
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
  actionPath,
  top: { actionConstant: { type: actionType } },
}) {
  if (!isObject(data)) {
    const message = `'data' argument at ${actionPath.join('.')} should be an object or an array of objects, instead of: ${JSON.stringify(data)}`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  if (requiredIdTypes.includes(actionType) && data.id == null) {
    const message = `'data' argument at ${actionPath.join('.')} contains some models without an 'id' attribute`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  if (forbiddenIdTypes.includes(actionType) && data.id != null) {
    const message = `Cannot use 'id' ${data.id}: 'update' actions cannot specify 'id' attributes in 'data' argument, because ids cannot be updated. Use 'filter' argument instead.`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }
};

const requiredIdTypes = ['replace'];
const forbiddenIdTypes = ['update'];

const isModelType = function (val) {
  if (isObject(val)) { return true; }

  return Array.isArray(val) && val.every(isObject);
};

const isObject = function (obj) {
  return obj && obj.constructor === Object;
};

const getNestedKeys = function ({ data, actionPath, top, modelsMap }) {
  const nestedKeys = data
    .map(Object.keys)
    .reduce(assignArray, []);
  const nestedKeysA = uniq(nestedKeys);
  const nestedKeysB = nestedKeysA.filter(attrName => {
    const model = getModel({
      top,
      modelsMap,
      actionPath: [...actionPath, attrName],
    });
    return model !== undefined && model.modelName !== undefined;
  });
  return nestedKeysB;
};

const getNestedActions = function ({
  data,
  dataPaths,
  actionPath,
  top,
  modelsMap,
  nestedKeys,
}) {
  return nestedKeys
    .map(nestedKey => {
      const nestedActionPath = [...actionPath, nestedKey];
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
        actionPath: nestedActionPath,
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
  actionPath,
  dataPaths,
  top,
  top: { actionConstant: { type: topType, multiple } },
  modelsMap,
  nestedKeys,
}) {
  const { modelName } = getModel({ top, modelsMap, actionPath });

  // Nested actions due to nested `args.data` reuses top-level action
  // Others are simply for selection, i.e. are find actions
  const isTopLevel = actionPath.length === 1;
  const isArray = isTopLevel ? multiple : true;
  const actionConstant = getActionConstant({ actionType: topType, isArray });

  const dataA = data.map(datum => mapData({ datum, nestedKeys }));
  const args = { data: dataA };

  return { actionPath, args, actionConstant, modelName, dataPaths };
};

const mapData = function ({ datum, nestedKeys }) {
  const datumA = mapValues(
    datum,
    (value, key) => mapDataValue({ value, key, nestedKeys }),
  );
  // Update actions do not use ids in args.data,
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
    .filter(readAction => readAction.actionPath.length !== 1);
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
  return actions.find(({ actionPath }) =>
    actionPath.join('.') === action.actionPath.join('.')
  );
};

module.exports = {
  parseDataArg,
};
