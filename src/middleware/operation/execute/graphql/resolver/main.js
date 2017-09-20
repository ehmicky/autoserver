'use strict';

const { reduceAsync } = require('../../../../../utilities');

const { resolveRead } = require('./read');
const { resolveWrite } = require('./write');

const resolveActions = function ({ actionsGroups, nextLayer, mInput }) {
  const writeActions = getWriteActions({ actionsGroups });
  const readActions = getReadActions({ actionsGroups });
  const actionsSuperGroups = [writeActions, ...readActions];
  return reduceAsync(
    actionsSuperGroups,
    (responses, actionsGroupsA) => fireResolver({
      responses,
      actionsGroups: actionsGroupsA,
      nextLayer,
      mInput,
    }),
    [],
  );
};

const getWriteActions = function ({ actionsGroups }) {
  return actionsGroups.filter(actions => !isReadActions(actions));
};

const getReadActions = function ({ actionsGroups }) {
  return actionsGroups
    .filter(isReadActions)
    .map(actions => [actions]);
};

const getActionsGroupsType = function ({ actionsGroups }) {
  const isRead = actionsGroups.some(isReadActions);
  return isRead ? 'read' : 'write';
};

const isReadActions = function (actions) {
  return actions.some(({ actionConstant: { type } }) => type === 'find');
};

const fireResolver = function ({
  responses,
  actionsGroups,
  nextLayer,
  mInput,
}) {
  const type = getActionsGroupsType({ actionsGroups });
  return resolvers[type]({ actionsGroups, nextLayer, mInput, responses });
};

const resolvers = {
  read: resolveRead,
  write: resolveWrite,
};

module.exports = {
  resolveActions,
};
