'use strict';

const { toSentence } = require('underscore.string');

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
  const aliasesA = aliases.map(aliasA => `'${aliasA}'`);
  const aliasesB = toSentence(aliasesA);
  return `Aliases: ${aliasesB}.`;
};

const allDescriptions = [
  {
    test: ({ readonly }) => readonly,
    message: () => 'This attribute is readonly, i.e. can only be set when the model is created.',
  },
  {
    test: ({ value }) => value !== undefined,
    message: () => 'This attribute is set by the server, not the client.',
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
