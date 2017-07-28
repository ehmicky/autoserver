'use strict';

const { mapValues } = require('../../../utilities');

const { reduceInfo } = require('./reducer');

const reduceActions = function (requestInfo, loggerFilter) {
  const { actions } = requestInfo;
  if (!isObject(actions)) { return requestInfo; }

  const actionsA = mapValues(actions, actionInfo =>
    actionsReducers.reduce(
      (info, reducer) => reducer(info, loggerFilter),
      actionInfo,
    )
  );
  return Object.assign({}, requestInfo, { actions: actionsA });
};

const reduceArgData = function (actionInfo, loggerFilter) {
  const args = reduceInfo({
    info: actionInfo.args,
    attrName: 'data',
    filter: loggerFilter.argData,
  });
  return Object.assign({}, actionInfo, { args });
};

const reduceActionResponses = function (
  actionInfo,
  { actionResponses: filter },
) {
  const info = simplifyActionResponses(actionInfo);

  return reduceInfo({ info, attrName: 'responses', filter });
};

const simplifyActionResponses = function (actionInfo) {
  const { responses } = actionInfo;

  if (!Array.isArray(responses)) { return actionInfo; }

  const responsesA = responses.map(({ content } = {}) => content);
  return Object.assign({}, actionInfo, { responses: responsesA });
};

const isObject = obj => obj && obj.constructor === Object;

const actionsReducers = [
  reduceArgData,
  reduceActionResponses,
];

module.exports = {
  reduceActions,
};
