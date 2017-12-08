'use strict';

// Default `collection.name` to parent key
const normalizeClientCollname = function (coll, { collname }) {
  const { name = [collname] } = coll;
  const nameA = Array.isArray(name) ? name : [name];

  return { ...coll, name: nameA };
};

module.exports = {
  normalizeClientCollname,
};
