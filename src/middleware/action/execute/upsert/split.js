'use strict';

// Check among args.data which ones exist or not, using the result
// of the first "read" command
const getCreateModels = function ({ input: { args: { data } }, data: models }) {
  const modelsIds = models.map(({ id }) => id);

  if (Array.isArray(data)) {
    return data.filter(({ id }) => !modelsIds.includes(id));
  }

  if (modelsIds.includes(data.id)) { return []; }

  return data;
};

const getUpdateModels = function ({ input: { args: { data } }, data: models }) {
  const modelsIds = models.map(({ id }) => id);

  if (Array.isArray(data)) {
    return data.filter(({ id }) => modelsIds.includes(id));
  }

  if (modelsIds.includes(data.id)) { return data; }

  return [];
};

module.exports = {
  getCreateModels,
  getUpdateModels,
};
