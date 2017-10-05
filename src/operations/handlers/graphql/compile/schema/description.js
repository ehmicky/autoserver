'use strict';

const topDescriptions = {
  query: 'Fetch models',
  mutation: 'Modify models',
};

// Top-level action descriptions
const commandDescriptions = {
  findOne: ({ typeName }) => `Search for a ${typeName} model`,
  findMany: ({ typeName }) => `Search for ${typeName} models`,
  createOne: ({ typeName }) => `Create a ${typeName} model`,
  createMany: ({ typeName }) => `Create ${typeName} models`,
  replaceOne: ({ typeName }) => `Fully update a ${typeName} model`,
  replaceMany: ({ typeName }) => `Fully update ${typeName} models`,
  patchOne: ({ typeName }) => `Partially update a ${typeName} model`,
  patchMany: ({ typeName }) => `Partially update ${typeName} models`,
  deleteOne: ({ typeName }) => `Delete a ${typeName} model`,
  deleteMany: ({ typeName }) => `Delete ${typeName} models`,
};

// Retrieve the description of a `args.data|filter` type
const getArgTypeDescription = function (def, opts, inputObjectType) {
  const description = argTypesDescriptions[inputObjectType][def.command.name];
  if (description === undefined) { return; }

  return argTypesProcessors[inputObjectType](description);
};

const argTypesDescriptions = {
  data: {
    createOne: 'New model to create',
    createMany: 'New models to create',
    patchOne: 'Model attributes to update',
    patchMany: 'Models attributes to update',
    replaceOne: 'New model attributes',
    replaceMany: 'New models attributes',
  },
  filter: {
    findOne: 'Specifies which model to search for',
    findMany: 'Specifies which models to search for',
    patchOne: 'Specifies which model to update',
    patchMany: 'Specifies which models to update',
    deleteOne: 'Specifies which model to delete',
    deleteMany: 'Specifies which models to delete',
  },
};

const argTypesProcessors = {
  data (description) {
    const descriptionA = description.toLowerCase();
    return `'data' argument with the ${descriptionA}`;
  },
  filter (description) {
    const descriptionA = description.replace('Specifies ', '');
    return `'filter' argument specifying ${descriptionA}`;
  },
};

module.exports = {
  topDescriptions,
  commandDescriptions,
  getArgTypeDescription,
  argTypesDescriptions,
};
