'use strict';

const { sortArray } = require('../utilities');

// Order matters, as console printing uses it for sorting
const CATEGORIES = require('./categories');

// Returns measures but as a single string, for console debugging
const stringifyMeasures = function ({ phase = '', measuresGroups }) {
  const sortedMeasures = sortArray(measuresGroups, sortMeasures);
  return sortedMeasures
    .map(stringifyMeasure.bind(null, phase))
    .join('\n');
};

// Sort by category (asc) then by duration (desc)
const sortMeasures = function (
  { category: catA, average: timeA },
  { category: catB, average: timeB },
) {
  const compNum = sortByCategory({ catA, catB });
  if (compNum !== 0) { return compNum; }

  return sortByTime({ timeA, timeB });
};

const sortByCategory = function ({ catA, catB }) {
  const indexCatA = CATEGORIES.indexOf(catA);
  const indexCatB = CATEGORIES.indexOf(catB);
  if (indexCatA < indexCatB) { return -1; }
  if (indexCatA > indexCatB) { return 1; }
  return 0;
};

const sortByTime = function ({ timeA, timeB }) {
  if (timeA < timeB) { return 1; }
  if (timeA > timeB) { return -1; }
  return 0;
};

// Prints as a table
const stringifyMeasure = function (
  phase,
  { category, label, average, count, duration },
) {
  const phaseS = phase.padEnd(LENGTHS.phase);
  const categoryS = category.padEnd(LENGTHS.category);
  const labelS = label.padEnd(LENGTHS.label);
  const durationS = formatDuration(duration).padStart(LENGTHS.duration);
  const averageS = formatDuration(average).padStart(LENGTHS.average);
  const items = count === 1 ? 'item' : 'items';
  const countS = `${String(count).padStart(LENGTHS.count)} ${items}`;

  return `${phaseS} ${categoryS} ${labelS} ${durationS} = ${averageS} * ${countS}`;
};

const formatDuration = function (duration) {
  const durationA = Math.round(duration * DECIMALS_EXP) / DECIMALS_EXP;

  const durationB = String(durationA);
  const [, integer, decimals] = DECIMALS_REGEXP.exec(durationB);
  const decimalsA = decimals.padEnd(DECIMALS_COUNT).replace(/ /g, '0');

  const durationC = `${integer}.${decimalsA}ms`;
  return durationC;
};

// '1.2345' -> '1', '2345'
const DECIMALS_REGEXP = /(\d*)\.?(\d*)/;

const DECIMALS_COUNT = 2;
const DECIMALS_EXP = 1e2;

// How wide each column is
const LENGTHS = {
  phase: 8,
  category: 10,
  label: 26,
  duration: 11,
  average: 10,
  count: 3,
};

module.exports = {
  stringifyMeasures,
};
