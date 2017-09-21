'use strict';

const { reduceAsync, assignArray } = require('../../../../utilities');

const sequenceActions = async function ({
  actionsGroups: { writeActions, readActions },
  nextLayer,
  otherLayer,
  mInput,
}) {
  const writeResponses = await getWriteResponses({
    writeActions,
    nextLayer,
    otherLayer,
    mInput,
  });
  const readResponses = await getReadResponses({
    readActions,
    writeResponses,
    nextLayer,
    otherLayer,
    mInput,
  });
  return [...writeResponses, ...readResponses];
};

const getWriteResponses = async function ({
  writeActions,
  nextLayer,
  otherLayer,
  mInput,
}) {
  const responsesPromises = writeActions.map(actionsGroup => otherLayer({
    actionsGroupType: 'write',
    actionsGroup,
    nextLayer,
    mInput,
  }));
  const responses = await Promise.all(responsesPromises);
  const responsesA = responses.reduce(assignArray, []);
  return responsesA;
};

const getReadResponses = function ({
  readActions,
  writeResponses,
  nextLayer,
  otherLayer,
  mInput,
}) {
  return reduceAsync(
    readActions,
    getReadResponse.bind(null, { nextLayer, otherLayer, mInput }),
    writeResponses,
  );
};

const getReadResponse = async function (
  { nextLayer, otherLayer, mInput },
  responses,
  actionsGroup,
) {
  const responsesA = await otherLayer({
    actionsGroupType: 'read',
    actionsGroup,
    nextLayer,
    mInput,
    responses,
  });
  return [...responses, ...responsesA];
};

module.exports = {
  sequenceActions,
};
