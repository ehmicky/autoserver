'use strict';


const { getFirstReadInput } = require('./first_read');
const { getCreateInput } = require('./create');
const { getUpdateInput } = require('./update');
const { getSecondReadInput } = require('./second_read');


// Perform a "read" database action, followed by a "create" or
// "update" database action
const performUpsert = async function ({ input, prefix }) {
  // First check if models exist or not, by performing a "read" database action
  const firstReadInput = getFirstReadInput({ input, prefix });
  const { data: models } = await this.next(firstReadInput);

  const { createModels, updateModels } = splitModels({ input, models });

  // If models do not exist, create them with "create" database action
  if (isDefined({ models: createModels })) {
    const createInput = getCreateInput({ input, data: createModels });
    await this.next(createInput);
  }

  // If models exist, update them with "update" database action
  if (isDefined({ models: updateModels })) {
    const updateInput = getUpdateInput({ input, data: updateModels });
    await this.next(updateInput);
  }

  // Finally, retrieve output with a second "read" database action
  const secondReadInput = getSecondReadInput({ input, prefix });
  const response = await this.next(secondReadInput);

  return response;
};

// Check among args.data which ones exist or not, using the result
// of the first "read" database action
const splitModels = function ({ input: { args: { data } }, models }) {
  const modelsIds = models.map(({ id }) => id);

  if (data instanceof Array) {
    const createModels = data.filter(({ id }) => !modelsIds.includes(id));
    const updateModels = data.filter(({ id }) => modelsIds.includes(id));
    return { createModels, updateModels };
  } else {
    if (modelsIds.includes(data.id)) {
      return { createModels: [], updateModels: data };
    } else {
      return { createModels: data, updateModels: [] };
    }
  }
};

// If there no models to create or update, avoid performing a database action
const isDefined = function ({ models }) {
  if (!models) { return false; }
  if (models instanceof Array) {
    return models.length > 0;
  } else if (models.constructor === Object) {
    return true;
  }
};


module.exports = {
  performUpsert,
};
