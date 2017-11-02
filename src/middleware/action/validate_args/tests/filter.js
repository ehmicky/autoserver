'use strict';

const {
  stringTest,
  objectOrArrayTest,
} = require('../../../../fast_validation');

// Validates args.id
const idTests = [
  { ...stringTest('id'), argName: 'id' },
];

// Validates args.filter
const filterTests = [
  { ...objectOrArrayTest('filter'), argName: 'filter' },
];

module.exports = {
  id: idTests,
  filter: filterTests,
};
