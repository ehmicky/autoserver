'use strict';

// Default `collection.model` to parent key
const addDefaultCollname = function (coll, { collname }) {
  if (coll.model) { return coll; }

  return { ...coll, model: collname };
};

module.exports = {
  addDefaultCollname,
};
