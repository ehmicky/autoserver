'use strict';

const filterField = function (def, opts) {
  const isFiltered = filters.some(filter => filter(def, opts));
  return isFiltered ? null : def;
};

// `patchOne|patchMany` do not allow data.id
const patchIdData = function ({ command }, { inputObjectType, defName }) {
  return inputObjectType === 'data' &&
    command.type === 'patch' &&
    defName === 'id';
};

// `model.authorize` never authorize this `$command` for that model
const isForbiddenCommand = function (
  { command, model },
  { parentDef, allowedCommandsMap },
) {
  return ['Query', 'Mutation'].includes(parentDef.model) &&
    !allowedCommandsMap[model].includes(command.type);
};

const filters = [
  patchIdData,
  isForbiddenCommand,
];

module.exports = {
  filterField,
};
