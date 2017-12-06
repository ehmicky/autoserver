'use strict';

const { mapValues, omitBy } = require('../../../../../../../utilities');

const { addCommand } = require('./command');
const { getNestedColl } = require('./nested_colls');
const { filterField } = require('./filter');
const { getFinalField } = require('./final_fields');
const { addNoAttributes } = require('./no_attributes');

// Retrieve the fields of an object, using schema definition
const getObjectFields = function (opts) {
  const fields = mappers.reduce(
    reduceFields.bind(null, opts),
    opts.parentDef.attributes,
  );
  const fieldsA = addNoAttributes({ fields });
  return fieldsA;
};

const mappers = [
  addCommand,
  getNestedColl,
  filterField,
  getFinalField,
];

const reduceFields = function (opts, fields, mapper) {
  const fieldsA = mapValues(
    fields,
    mapField.bind(null, { opts, mapper }),
  );
  return omitBy(fieldsA, def => def == null);
};

const mapField = function ({ opts, mapper }, def, defName) {
  return mapper(def, { ...opts, defName });
};

module.exports = {
  getObjectFields,
};
