'use strict';

const { getWordsList, uniq, flatten } = require('../../../utilities');

const { TYPES } = require('./available');

// Validates either a model attribute against `patchOp.attribute`,
// or an argument against `patchOp.argument`
const validateTypes = function ({ possTypes, attrTypes, attrIsArray, strict }) {
  const isValid = attrTypes.every(attrType =>
    validateType({ possTypes, attrType, attrIsArray, strict }));
  if (isValid) { return; }

  const validTypes = getValidTypes({ possTypes, strict });
  return validTypes;
};

const validateType = function ({ possTypes, attrType, attrIsArray, strict }) {
  return possTypes
    .some(possType => checkType({ possType, attrType, attrIsArray, strict }));
};

const checkType = function ({ possType, attrType, attrIsArray, strict }) {
  const { isArray: possIsArray, type: possTypeA } = parseType({
    type: possType,
  });

  if (isWrongType({ possIsArray, attrIsArray, strict })) { return false; }

  // Empty array
  if (attrType === 'none') { return true; }

  const isSameType = compareTypes({ possType: possTypeA, attrType });
  return isSameType;
};

const isWrongType = function ({ possIsArray, attrIsArray, strict }) {
  return shouldBeArray({ possIsArray, attrIsArray }) ||
    shouldNotBeArray({ possIsArray, attrIsArray, strict });
};

// If TYPE[] is required, attribute must be an array
// If TYPE is required, attribute can be either scalar or an array
// (whose each element will be checked)
const shouldBeArray = function ({ possIsArray, attrIsArray }) {
  return possIsArray && !attrIsArray;
};

// For argument values, we do a strict check, i.e. `isArray` must match
const shouldNotBeArray = function ({ possIsArray, attrIsArray, strict }) {
  return !possIsArray && attrIsArray && strict;
};

const compareTypes = function ({ possType, attrType }) {
  return possType === attrType ||
    // `number` includes `integer`
    (possType === 'number' && attrType === 'integer');
};

// Returns human-friendly list of possible types
const getValidTypes = function ({ possTypes, strict }) {
  const validTypes = possTypes
    .map(possType => getValidType({ type: possType, strict }));
  const singularTypes = stringifyTypes({ validTypes, name: 'name' });
  const pluralTypes = stringifyTypes({ validTypes, name: 'pluralname' });

  if (!pluralTypes) { return singularTypes; }

  const pluralTypesA = `an array of ${pluralTypes}`;

  if (!singularTypes) { return pluralTypesA; }

  return `${singularTypes}, or ${pluralTypesA}`;
};

const stringifyTypes = function ({ validTypes, name }) {
  const validTypesA = validTypes.map(validType => validType[name]);
  const validTypesB = flatten(validTypesA);
  const validTypesC = validTypesB.filter(validType => validType !== undefined);
  const validTypesD = uniq(validTypesC);
  const validTypesE = getWordsList(validTypesD);
  return validTypesE;
};

const getValidType = function ({ type, strict }) {
  const { isArray, type: typeA } = parseType({ type });

  const { name, pluralname } = TYPES[typeA];

  if (isArray) {
    return { pluralname };
  }

  if (!strict) {
    return { name, pluralname };
  }

  return { name };
};

const parseType = function ({ type }) {
  const isArray = type.endsWith('[]');
  const typeA = type.replace('[]', '');

  return { isArray, type: typeA };
};

module.exports = {
  validateTypes,
};
