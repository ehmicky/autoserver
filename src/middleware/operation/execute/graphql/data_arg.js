'use strict';

const { uniq } = require('lodash');

const { throwError } = require('../../../../error');
const { mapValues, assignArray, omitBy } = require('../../../../utilities');

const {
  getTopLevelAction,
  isTopLevelAction,
  getModel,
  getActionConstant,
} = require('./utilities');

const parseDataArg = function ({ actions, modelsMap }) {
  const topLevelAction = getTopLevelAction({ actions });
  const { actionPath, args: { data } } = topLevelAction;

  if (data === undefined) { return actions; }

  const dataPaths = getDataPath({ data, path: actionPath });
  const actionsA = parseData({
    data,
    actionPath,
    dataPaths,
    modelsMap,
    topLevelAction,
  });
  const actionsB = mergeActions({
    readActions: actions,
    writeActions: actionsA,
  });
  return actionsB;
};

const parseData = function ({
  data,
  actionPath,
  dataPaths,
  modelsMap,
  topLevelAction,
}) {
  const dataA = normalizeData({ data });

  dataA.forEach(
    datum => validateData({ data: datum, actionPath, topLevelAction })
  );

  const nestedKeys = getNestedKeys({
    data: dataA,
    actionPath,
    modelsMap,
    topLevelAction,
  });
  const nestedActions = getNestedActions({
    data: dataA,
    actionPath,
    dataPaths,
    modelsMap,
    topLevelAction,
    nestedKeys,
  });
  const action = getAction({
    data: dataA,
    actionPath,
    dataPaths,
    modelsMap,
    topLevelAction,
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
  topLevelAction: { actionConstant: { type: actionType } },
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

const requiredIdTypes = ['upsert', 'replace'];
const forbiddenIdTypes = ['update'];

const isModelType = function (val) {
  if (isObject(val)) { return true; }

  return Array.isArray(val) && val.every(isObject);
};

const isObject = function (obj) {
  return obj && obj.constructor === Object;
};

const getNestedKeys = function ({
  data,
  actionPath,
  modelsMap,
  topLevelAction,
}) {
  const nestedKeys = data
    .map(Object.keys)
    .reduce(assignArray, []);
  const nestedKeysA = uniq(nestedKeys);
  const nestedKeysB = nestedKeysA.filter(attrName => {
    const model = getModel({
      modelsMap,
      topLevelAction,
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
  modelsMap,
  topLevelAction,
  nestedKeys,
}) {
  return nestedKeys
    .map(nestedKey => {
      const nestedActionPath = [...actionPath, nestedKey];
      const nestedData = data
        .map(datum => datum[nestedKey])
        .reduce(assignArray, []);
      const nestedDataA = nestedData.filter(isObject);

      // In the same collection, some keys might be populated, and others not
      // E.g. [{ child: { id: 'id', ... } }, { child: 'id' }]
      // Partial actions are marked so that both a write and a read actions
      // are fired, since the write action's return value alone is partial.
      // The flag is inherited by children.
      const isPartial = nestedData.length !== nestedDataA.length;

      const nestedDataPaths = isPartial
        ? []
        : dataPaths
          .map((dataPath, index) => getDataPath({
            data: data[index][nestedKey],
            path: [...dataPath, nestedKey],
          }))
          .reduce(assignArray, []);

      return parseData({
        data: nestedDataA,
        actionPath: nestedActionPath,
        dataPaths: nestedDataPaths,
        modelsMap,
        topLevelAction,
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
  modelsMap,
  topLevelAction,
  topLevelAction: { actionConstant: { type: topType, multiple } },
  nestedKeys,
}) {
  const { modelName } = getModel({ modelsMap, topLevelAction, actionPath });

  // Nested actions due to nested `args.data` reuses top-level action
  // Others are simply for selection, i.e. are find actions
  const isTopLevel = isTopLevelAction({ actionPath });
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
  const readActionsA = writeActions.map(writeAction => {
    const readAction = findAction({
      actions: readActions,
      action: writeAction,
    });
    if (!readAction) { return writeAction; }

    // We want `writeAction` to have priority, but also want to keep keys order,
    // hence we repeat `...writeAction`
    return {
      ...writeAction,
      ...readAction,
      ...writeAction,
      args: { ...readAction.args, ...writeAction.args },
    };
  });

  const writeActionsA = readActions.filter(oldAction => {
    const readAction = findAction({ actions: writeActions, action: oldAction });
    return readAction === undefined || readAction.dataPaths.length === 0;
  });

  return [...writeActionsA, ...readActionsA];
};

const findAction = function ({ actions, action }) {
  return actions.find(({ actionPath }) =>
    actionPath.join('.') === action.actionPath.join('.')
  );
};

module.exports = {
  parseDataArg,
};
