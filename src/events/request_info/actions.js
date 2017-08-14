'use strict';

const { mapValues } = require('../../utilities');

const { reduceInfo } = require('./reducer');

const reduceActions = function (requestInfo, eventFilter) {
  const { actions } = requestInfo;
  if (!isObject(actions)) { return requestInfo; }

  const actionsA = mapValues(
    actions,
    actionInfo => reduceAction(actionInfo, eventFilter),
  );
  return { ...requestInfo, actions: actionsA };
};

const reduceAction = function (actionInfo, eventFilter) {
  return actionsReducers.reduce(
    (info, reducer) => reducer(info, eventFilter),
    actionInfo,
  );
};

const reduceArgData = function (actionInfo, { argData: eventFilter }) {
  const { args } = actionInfo;
  const argsA = reduceInfo({ info: args, attrName: 'data', eventFilter });
  return { ...actionInfo, args: argsA };
};

const reduceActionResponses = function (
  actionInfo,
  { actionResponses: eventFilter },
) {
  const info = simplifyActionResponses(actionInfo);

  return reduceInfo({ info, attrName: 'responses', eventFilter });
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
