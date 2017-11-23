'use strict';

const { toSentence } = require('underscore.string');

// Turn ['a', 'b', 'c'] into 'a, b or c'
const getWordsList = function (
  words,
  {
    op = 'or',
    quotes = false,
    json = false,
  } = {},
) {
  if (words.length === 0) { return ''; }

  const wordsA = jsonStringify(words, { json });
  const wordsB = quoteWords(wordsA, { quotes });
  const wordsC = toSentence(wordsB, ', ', `, ${op} `);
  return wordsC;
};

const jsonStringify = function (words, { json }) {
  if (!json) { return words; }

  return words.map(JSON.stringify);
};

const quoteWords = function (words, { quotes }) {
  if (!quotes) { return words; }

  return words.map(word => `'${word}'`);
};

module.exports = {
  getWordsList,
};
