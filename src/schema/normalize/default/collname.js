'use strict';

// Default `collection.collname` to parent key
const addDefaultCollname = function (coll, { collname }) {
  if (coll.collname) { return coll; }

  return { ...coll, collname };
};

module.exports = {
  addDefaultCollname,
};
