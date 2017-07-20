'use strict';

// Check among args.data which ones exist or not, using the result
// of the first "read" command
const getCreateModels = function ({ input: { args: { data } }, data: models }) {
  if (Array.isArray(data)) {
    const modelsIds = models.map(({ id }) => id);
    return data.filter(({ id }) => !modelsIds.includes(id));
  }

  if (models.id === data.id) { return []; }

  return data;
};

const getUpdateModels = function ({ input: { args: { data } }, data: models }) {
  if (Array.isArray(data)) {
    const modelsIds = models.map(({ id }) => id);
    return data.filter(({ id }) => modelsIds.includes(id));
  }

  if (models.id === data.id) { return data; }

  return [];
};

module.exports = {
  getCreateModels,
  getUpdateModels,
};
