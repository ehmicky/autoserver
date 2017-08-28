'use strict';

const {
  objectTest,
  objectArrayTest,
} = require('../../../../../fast_validation');

// Validates single args.data, with no required `id`
const singleDataTests = [
  { ...objectTest('data'), argName: 'data' },
];

// Validates single args.data, with required `id`
const singleDataWithIdTests = [
  ...singleDataTests,

  {
    argName: 'data',
    test ({ data }) {
      if (data == null) { return true; }

      return data.id != null;
    },
    message: 'must have an \'id\' attribute',
  },
];

// Validates multiple args.data, with no required `id`
const multipleDataTests = [
  { ...objectArrayTest('data'), argName: 'data' },
];

// Validates multiple args.data, with required `id`
const multipleDataWithIdTests = [
  ...multipleDataTests,

  {
    argName: 'data',
    test ({ data }) {
      if (data == null) { return true; }

      return data.every(datum => datum && datum.id != null);
    },
    message: 'must have an \'id\' attribute',
  },
];

module.exports = {
  single_data: singleDataTests,
  single_data_with_id: singleDataWithIdTests,
  multiple_data: multipleDataTests,
  multiple_data_with_id: multipleDataWithIdTests,
};
