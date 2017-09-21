'use strict';

const { reduceAsync, assignArray } = require('../../../../../utilities');

const { resolveRead } = require('./read');
const { resolveWrite } = require('./write');

const sequencer = async function ({
  actionsGroups: { writeActions, readActions },
  nextLayer,
  mInput,
}) {
  const writeResponses = await getWriteResponses({
    writeActions,
    nextLayer,
    mInput,
  });
  const readResponses = await getReadResponses({
    readActions,
    writeResponses,
    nextLayer,
    mInput,
  });
  return [...writeResponses, ...readResponses];
};

const getWriteResponses = async function ({ writeActions, nextLayer, mInput }) {
  const responsesPromises = writeActions
    .map(actionsGroup => resolveWrite({ actionsGroup, nextLayer, mInput }));
  const responses = await Promise.all(responsesPromises);
  const responsesA = responses.reduce(assignArray, []);
  return responsesA;
};

const getReadResponses = function ({
  readActions,
  writeResponses,
  nextLayer,
  mInput,
}) {
  return reduceAsync(
    readActions,
    getReadResponse.bind(null, { nextLayer, mInput }),
    writeResponses,
  );
};

const getReadResponse = async function (
  { nextLayer, mInput },
  responses,
  actionsGroup,
) {
  const responsesA = await resolveRead({
    actionsGroup,
    nextLayer,
    mInput,
    responses,
  });
  return [...responses, ...responsesA];
};

module.exports = {
  sequencer,
};
