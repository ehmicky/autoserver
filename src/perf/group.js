'use strict';

const { groupBy } = require('../utilities');

// Normalize and group measures, returning an array of:
//  - [category="default"] {string}
//  - label {string}
//  - duration {number} - sum of all measures durations, in milliseconds
//  - measures {number[]} - each measure duration, in milliseconds
//  - count {number} - number of measures
//  - average {number} - average measure duration, in milliseconds
const groupMeasures = function ({ measures }) {
  // Only keep finished measures
  const filteredMeasures = measures
    .filter(({ duration }) => duration !== undefined);
  // Group measures belonging to the same category and label
  const groupedMeasures = groupBy(filteredMeasures, ['category', 'label']);
  return Object.values(groupedMeasures)
    .map(items => getGroupMeasure({ measures: items }));
};

// Calculate aggregate for measures belonging to the same category and label
const getGroupMeasure = function ({ measures }) {
  const [{ category, label }] = measures;
  const count = measures.length;
  // Use milliseconds, but with nanoseconds precision
  const duration = measures
    .reduce((sum, measure) => sum + measure.duration / 10 ** 6, 0);
  const average = duration / count;
  const items = measures.map(measure => measure.duration / 10 ** 6);

  return { category, label, duration, measures: items, count, average };
};

module.exports = {
  groupMeasures,
};
