'use strict';

const reduceAllModels = function (requestInfo, loggerFilter) {
  setPayload(requestInfo, loggerFilter);
  setActions(requestInfo, loggerFilter);
  setResponse(requestInfo, loggerFilter);
};

const setPayload = function (requestInfo, loggerFilter) {
  reduceModels({
    info: requestInfo,
    attrName: 'payload',
    filter: loggerFilter.payload,
  });
};

const setActions = function (requestInfo, loggerFilter) {
  const { actions } = requestInfo;
  if (!actions || actions.constructor !== Object) { return; }

  for (const actionInfo of Object.values(actions)) {
    setArgData(actionInfo, loggerFilter);
    setActionResponses(actionInfo, loggerFilter);
  }
};

const setArgData = function (actionInfo, loggerFilter) {
  reduceModels({
    info: actionInfo.args,
    attrName: 'data',
    filter: loggerFilter.argData,
  });
};

const setActionResponses = function (actionInfo, loggerFilter) {
  if (actionInfo.responses && Array.isArray(actionInfo.responses)) {
    actionInfo.responses = actionInfo.responses.map(({ content } = {}) =>
      content
    );
  }

  reduceModels({
    info: actionInfo,
    attrName: 'responses',
    filter: loggerFilter.actionResponses,
  });
};

const setResponse = function (requestInfo, loggerFilter) {
  reduceModels({
    info: requestInfo,
    attrName: 'response',
    filter: loggerFilter.response,
  });
};

const reduceModels = function ({ info, attrName, filter }) {
  if (!info || info[attrName] === undefined) { return; }

  const size = getSize({ value: info[attrName] });
  info[`${attrName}Size`] = size;

  modelReducer({ info, attrName, filter });
};

const modelReducer = function ({ info, attrName, filter }) {
  if (Array.isArray(info[attrName])) {
    info[`${attrName}Count`] = info[attrName].length;
    info[attrName] = info[attrName]
      .filter(isObject)
      .map(obj => filter(obj));
  } else if (isObject(info[attrName])) {
    info[attrName] = filter(info[attrName]);
  } else if (!info[attrName]) {
    delete info[attrName];
  }
};

const isObject = obj => obj && obj.constructor === Object;

const getSize = function ({ value }) {
  try {
    return JSON.stringify(value).length;
  } catch (error) {
    return 'unknown';
  }
};

module.exports = {
  reduceAllModels,
};
