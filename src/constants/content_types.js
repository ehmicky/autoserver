'use strict';

const { makeImmutable } = require('../utilities');

const CONTENT_TYPES = [
  {
    name: 'model',
    test ({ content }) {
      return content && content.constructor === Object && isJSON(content);
    },
  },

  {
    name: 'collection',
    test ({ content }) {
      return content && typeof content === 'object' && isJSON(content);
    },
  },

  {
    name: 'error',
    test ({ content }) {
      return content && content.constructor === Object && isJSON(content);
    },
  },

  {
    name: 'object',
    test ({ content }) {
      return content && content.constructor === Object && isJSON(content);
    },
  },

  {
    name: 'html',
    test ({ content }) {
      return typeof content === 'string';
    },
  },

  {
    name: 'text',
    test ({ content }) {
      return typeof content === 'string';
    },
  },

  {
    name: 'failure',
    test ({ content }) {
      return content === undefined;
    },
  },
];
makeImmutable(CONTENT_TYPES);

const isJSON = function (val) {
  try {
    JSON.stringify(val);
  } catch (error) { return false; }

  return true;
};

module.exports = {
  CONTENT_TYPES,
};
