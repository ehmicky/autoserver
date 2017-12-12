'use strict';

const { mapColls } = require('../helpers');

// Default `collection.name` to parent key
const mapColl = function ({ collname, coll: { name = [collname] } }) {
  const nameA = Array.isArray(name) ? name : [name];

  return { name: nameA };
};

const normalizeClientCollname = mapColls.bind(null, mapColl);

module.exports = {
  normalizeClientCollname,
};
