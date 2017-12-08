'use strict';

const { getWordsList } = require('../../utilities');

// Add related `attr.description`, for the following features:
// `attr.readonly`, `attr.value`, `attr.examples`, `attr.alias`
const addDescriptions = function (attr) {
  const descriptions = allDescriptions.filter(({ test: func }) => func(attr));
  if (descriptions.length === 0) { return attr; }

  const { description } = attr;
  const descriptionA = description ? [description] : [];

  const descriptionsA = descriptions.map(({ message }) => message(attr));
  const descriptionB = [...descriptionA, ...descriptionsA].join('\n');

  return { ...attr, description: descriptionB };
};

const getExamples = function ({ examples }) {
  const examplesA = examples
    .map(example => `  - ${example}`)
    .join('\n');
  return `Examples:\n${examplesA}`;
};

const getAliasesDescription = function ({ alias }) {
  const aliases = Array.isArray(alias) ? alias : [alias];
  const aliasesA = getWordsList(aliases, { op: 'and', quotes: true });
  return `Aliases: ${aliasesA}.`;
};

const allDescriptions = [
  {
    test: ({ readonly }) => readonly === true,
    message: () => 'This attribute is readonly, i.e. cannot be modified.',
  },
  {
    test: ({ value }) => value !== undefined,
    message: () => 'This attribute is transformed or set by the server',
  },
  {
    test: ({ examples }) => examples !== undefined,
    message: getExamples,
  },
  {
    test: ({ alias }) => alias !== undefined,
    message: getAliasesDescription,
  },
  {
    test: ({ aliasOf }) => aliasOf !== undefined,
    message: ({ aliasOf }) => `Alias of '${aliasOf}'.`,
  },
];

module.exports = {
  addDescriptions,
};
