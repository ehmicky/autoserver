'use strict';

const { flatten } = require('../../../utilities');

const mapColls = function (collections) {
  const map = Object.entries(collections)
    .map(([collname, { name }]) => mapColl({ collname, name }));
  const mapA = flatten(map);
  const mapB = Object.assign({}, ...mapA);
  return mapB;
};

const mapColl = function ({ collname, name }) {
  return name.map(nameA => ({ [nameA]: collname }));
};

// Returns a map from clientCollname to collname
// Example: { my_name: 'my_coll', ... }
const collsNames = { mapColls };

module.exports = {
  collsNames,
};
