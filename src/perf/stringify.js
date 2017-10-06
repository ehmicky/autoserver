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
  const phaseS = phase.padEnd(lengths.phase);
  const categoryS = category.padEnd(lengths.category);
  const labelS = label.padEnd(lengths.label);
  const durationS = `${Math.round(duration)}ms`.padEnd(lengths.duration);
  const averageS = `${Math.round(average)}ms`.padEnd(lengths.average);
  const items = count === 1 ? 'item' : 'items';
  const countS = `${String(count).padStart(lengths.count)} ${items}`;

  return `${phaseS} ${categoryS} ${labelS} ${durationS} = ${averageS} * ${countS}`;
};

// How wide each column is
const lengths = {
  phase: 8,
  category: 10,
  label: 26,
  duration: 8,
  average: 7,
  count: 3,
};

module.exports = {
  stringifyMeasures,
};
