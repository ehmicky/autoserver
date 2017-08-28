'use strict';

const {
  objectTest,
  objectArrayTest,
} = require('../../../../../fast_validation');

// Validates single args.data, with no required `id`
const singleDataTests = [
  { ...objectTest('data'), argName: 'data' },
];

const rSingleDataIdTests = [{
  argName: 'data',
  test ({ data }) {
    if (data == null) { return true; }

    return data.id != null;
  },
  message: 'must have an \'id\' attribute',
}];

// Validates single args.data, with required `id`
const singleDataWithIdTests = [
  ...singleDataTests,
  ...rSingleDataIdTests,
];

// Validates multiple args.data, with no required `id`
const multipleDataTests = [
  { ...objectArrayTest('data'), argName: 'data' },
];

const rMultipleDataIdTests = [{
  argName: 'data',
  test ({ data }) {
    if (data == null) { return true; }

    return data.every(datum => datum && datum.id != null);
  },
  message: 'must have an \'id\' attribute',
}];

// Validates multiple args.data, with required `id`
const multipleDataWithIdTests = [
  ...multipleDataTests,
  ...rMultipleDataIdTests,
];

module.exports = {
  single_data: singleDataTests,
  single_data_with_id: singleDataWithIdTests,
  multiple_data: multipleDataTests,
  multiple_data_with_id: multipleDataWithIdTests,
};
