'use strict';

const { mapValues } = require('../../../utilities');

const { reduceInfo } = require('./reducer');

const reduceActions = function (requestInfo, logFilter) {
  const { actions } = requestInfo;
  if (!isObject(actions)) { return requestInfo; }

  const actionsA = mapValues(
    actions,
    actionInfo => reduceAction(actionInfo, logFilter),
  );
  return { ...requestInfo, actions: actionsA };
};

const reduceAction = function (actionInfo, logFilter) {
  return actionsReducers.reduce(
    (info, reducer) => reducer(info, logFilter),
    actionInfo,
  );
};

const reduceArgData = function (actionInfo, { argData: logFilter }) {
  const { args } = actionInfo;
  const argsA = reduceInfo({ info: args, attrName: 'data', logFilter });
  return { ...actionInfo, args: argsA };
};

const reduceActionResponses = function (
  actionInfo,
  { actionResponses: logFilter },
) {
  const info = simplifyActionResponses(actionInfo);

  return reduceInfo({ info, attrName: 'responses', logFilter });
};

const simplifyActionResponses = function (actionInfo) {
  const { responses } = actionInfo;

  if (!Array.isArray(responses)) { return actionInfo; }

  const responsesA = responses.map(({ content } = {}) => content);
  return { ...actionInfo, responses: responsesA };
};

const isObject = obj => obj && obj.constructor === Object;

const actionsReducers = [
  reduceArgData,
  reduceActionResponses,
];

module.exports = {
  reduceActions,
};
