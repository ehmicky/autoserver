'use strict';

// Default `collection.name` to parent key
const normalizeClientCollname = function (coll, { collname }) {
  const { name = [] } = coll;
  const nameA = Array.isArray(name) ? name : [name];
  const nameB = [collname, ...nameA];

  return { ...coll, name: nameB };
};

module.exports = {
  normalizeClientCollname,
};
