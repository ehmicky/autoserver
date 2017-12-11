'use strict';

const { mapColls } = require('../helpers');

// Default `collection.name` to parent key
const normalizeClientCollname = function ({ schema }) {
  return mapColls({ func: mapColl, schema });
};

const mapColl = function ({ collname, coll, coll: { name = [collname] } }) {
  const nameA = Array.isArray(name) ? name : [name];

  return { ...coll, name: nameA };
};

module.exports = {
  normalizeClientCollname,
};
