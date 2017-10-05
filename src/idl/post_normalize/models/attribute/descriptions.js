'use strict';

// Add related `attr.description`, when `attr.readonly` or `attr.value` is used
const addDescriptions = function (attr) {
  const descriptions = allDescriptions.filter(({ test: func }) => func(attr));
  if (descriptions.length === 0) { return attr; }

  const { description } = attr;
  const descriptionA = description ? [description] : [];

  const descriptionsA = descriptions.map(({ message }) => message);
  const descriptionB = [...descriptionA, ...descriptionsA].join('\n');

  return { ...attr, description: descriptionB };
};

const allDescriptions = [
  {
    test: ({ readonly }) => readonly,
    message: 'This attribute is readonly, i.e. can only be set when the model is created.',
  },
  {
    test: ({ value }) => value !== undefined,
    message: 'This attribute is set by the server, not the client.',
  },
];

module.exports = {
  addDescriptions,
};
