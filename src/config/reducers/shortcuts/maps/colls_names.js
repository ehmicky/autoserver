'use strict';

// Returns a map from clientCollname to collname
// Example: { my_name: 'my_coll', ... }
const collsNames = function ({ config: { collections } }) {
  const map = Object.entries(collections)
    .map(([collname, { name }]) => getNames({ collname, name }));
  const mapA = Object.assign({}, ...map);
  return mapA;
};

const getNames = function ({ collname, name }) {
  const names = name.map(nameA => ({ [nameA]: collname }));
  const namesA = Object.assign({}, ...names);
  return namesA;
};

module.exports = {
  collsNames,
};
