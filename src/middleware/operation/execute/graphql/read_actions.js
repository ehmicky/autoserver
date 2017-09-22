'use strict';

const { reduceAsync } = require('../../../../utilities');

const resolveReadActions = async function ({
  actions: allActions,
  nextLayer,
  otherLayer,
  mInput,
  topArgs,
  responses,
}) {
  const readActions = getReadActions({ allActions });
  const responsesA = await reduceAsync(
    readActions,
    getReadResponse.bind(null, { nextLayer, otherLayer, mInput, topArgs }),
    responses,
  );
  return [...responses, ...responsesA];
};

const getReadActions = function ({ allActions }) {
  return allActions
    .filter(({ actionConstant }) => actionConstant.type === 'find')
    .map(action => [action]);
};

const getReadResponse = async function (
  { nextLayer, otherLayer, mInput, topArgs },
  responses,
  actions,
) {
  const responsesA = await otherLayer({
    actionsGroupType: 'read',
    actions,
    nextLayer,
    mInput,
    topArgs,
    responses,
  });
  return [...responses, ...responsesA];
};

module.exports = {
  resolveReadActions,
};
