'use strict';

const { wrapCommand } = require('./wrap');

const deleteMany = function ({ collection, deletedIds }) {
  Object.entries(collection)
    .filter(([, model]) => deletedIds.includes(model.id))
    // eslint-disable-next-line fp/no-mutating-methods
    .map(([index], count) => collection.splice(index - count, 1)[0]);
};

const wDelete = wrapCommand.bind(null, deleteMany);

module.exports = {
  delete: wDelete,
};
