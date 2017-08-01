'use strict';

// Fix `required` attribute according to the current command.name
const getRequired = function ({ model, command }) {
  if (!Array.isArray(model.required)) { return {}; }

  const required = getClientInputRequired({ model, command });
  return { required };
};

const getClientInputRequired = function ({ model: { required }, command }) {
  // Nothing is required for those command.name,
  // except maybe `id` (previously validated)
  if (optionalInputCommands.includes(command.name)) { return []; }

  // `id` requiredness has already been checked by previous validator,
  // so we skip it here
  return required.filter(requiredProp => requiredProp !== 'id');
};

const optionalInputCommands = [
  'readOne',
  'readMany',
  'deleteOne',
  'deleteMany',
];

module.exports = {
  getRequired,
};
