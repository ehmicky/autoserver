'use strict';

const { mapValues } = require('../../../utilities');
const { runSchemaFunc } = require('../../../schema_func');

// Performs transformation on data array or single data
const transformData = function ({
  data,
  schema: { shortcuts: { valuesMap } },
  modelName,
  mInput,
}) {
  const values = valuesMap[modelName];

  return data.map(datum => applyValue({ data: datum, values, mInput }));
};

const applyValue = function ({ data, values, mInput }) {
  const dataA = mapValues(
    values,
    (value, attrName) => applyTransform({ data, attrName, value, mInput }),
  );
  return { ...data, ...dataA };
};

const applyTransform = function ({ data, attrName, value, mInput }) {
  const currentVal = data[attrName];

  const vars = { $model: data, $val: currentVal };
  const valueA = runSchemaFunc({ schemaFunc: value, mInput, vars });

  return valueA;
};

module.exports = {
  transformData,
};
