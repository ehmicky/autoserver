'use strict';

// Fix `required` attribute according to the current command.name
const getRequired = function ({ model, command, type }) {
  if (!Array.isArray(model.required)) { return {}; }

  const requiredFunc = getRequiredFunc({ type });
  const required = requiredFunc({ model, command });
  return { required };
};

const getRequiredFunc = function ({ type }) {
  if (type === 'clientInputData') { return getClientInputRequired; }
  if (type === 'serverOutputData') { return getServerOutputRequired; }
  return getOtherRequired;
};

const getClientInputRequired = function ({ model: { required }, command }) {
  // Nothing is required for those command.name,
  // except maybe `id` (previously validated)
  if (optionalInputCommands.includes(command.name)) { return []; }

  // `id` requiredness has already been checked by previous validator,
  // so we skip it here
  return required.filter(requiredProp => requiredProp !== 'id');
};

const getServerOutputRequired = function ({ model: { required }, command }) {
  // Some command.name do not require normal attributes as output
  // (except for `id`)
  if (optionalOutputCommands.includes(command.name)) {
    return required.filter(requiredProp => requiredProp === 'id');
  }

  return required;
};

const getOtherRequired = function ({ value }) {
  return value;
};

const optionalInputCommands = [
  'readOne',
  'readMany',
  'deleteOne',
  'deleteMany',
];
const optionalOutputCommands = [
  'deleteOne',
  'deleteMany',
];

module.exports = {
  getRequired,
};
