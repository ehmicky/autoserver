'use strict';

const { difference } = require('lodash');

const { throwError } = require('../../../error');

const validateMissingIds = function ({
  indexes,
  collection,
  idCheck,
  filter,
}) {
  if (!idCheck) { return; }

  const idFilters = getIdFilters({ filter });

  if (idFilters.length === 0) { return; }

  const missingIds = isMissingIds({ indexes, collection, idFilters });

  if (missingIds.length === 0) { return; }

  const message = `Could not find the model with id ${missingIds[0]}`;
  throwError(message, { reason: 'DATABASE_NOT_FOUND' });
};

const getIdFilters = function ({ filter }) {
  if (Array.isArray(filter)) {
    return filter
      .map(singleFilter => getIdFilters({ filter: singleFilter })[0]);
  }

  const id = getId({ filter });

  if (id === undefined) { return []; }

  return Array.isArray(id) ? id : [id];
};

const getId = function ({ filter: { id, eq = {} } }) {
  if (id && typeof id === 'string') {
    return id;
  }

  return eq.id;
};

const getIdModels = function ({ indexes, collection }) {
  return indexes.map(index => collection[index].id);
};

const isMissingIds = function ({ indexes, collection, idFilters }) {
  const idModels = getIdModels({ indexes, collection });
  const missingIds = difference(idFilters, idModels);

  return missingIds;
};

module.exports = {
  validateMissingIds,
};
