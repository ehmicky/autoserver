'use strict';

const { CATEGORIES } = require('./constants');

// Returns measures but as a single string, for console debugging
const stringifyMeasures = function ({ phase = '', measuresGroups }) {
  return measuresGroups
    .sort(sortMeasures)
    .map(stringifyMeasure.bind(null, phase))
    .join('\n');
};

// Sort by category (asc) then by duration (desc)
const sortMeasures = function (
  { category: catA, duration: timeA },
  { category: catB, duration: timeB },
) {
  const indexCatA = CATEGORIES.indexOf(catA);
  const indexCatB = CATEGORIES.indexOf(catB);
  if (indexCatA < indexCatB) { return -1; }
  if (indexCatA > indexCatB) { return 1; }
  if (timeA < timeB) { return 1; }
  return timeA > timeB ? -1 : 0;
};

// Prints as a table
const stringifyMeasure = function (
  phase,
  { category, label, average, count, duration },
) {
  const phaseS = phase.padEnd(8);
  const categoryS = category.padEnd(12);
  const labelS = label.padEnd(26);
  const durationS = `${Math.round(duration)}ms`.padEnd(8);
  const averageS = `${Math.round(average)}ms`.padEnd(7);
  const items = count === 1 ? 'item' : 'items';
  const countS = `${String(count).padStart(3)} ${items}`;
  return `${phaseS} ${categoryS} ${labelS} ${durationS} = ${averageS} * ${countS}`;
};

module.exports = {
  stringifyMeasures,
};
