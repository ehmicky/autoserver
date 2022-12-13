import underscoreString from 'underscore.string'

// Turn ['a', 'b', 'c'] into 'a, b or c'
export const getWordsList = (
  words,
  { op = 'or', quotes = false, json = false } = {},
) => {
  if (words.length === 0) {
    return ''
  }

  const wordsA = jsonStringify(words, { json })
  const wordsB = quoteWords(wordsA, { quotes })
  const wordsC = underscoreString.toSentence(wordsB, ', ', ` ${op} `)
  return wordsC
}

const jsonStringify = (words, { json }) => {
  if (!json) {
    return words
  }

  return words.map(JSON.stringify)
}

const quoteWords = (words, { quotes }) => {
  if (!quotes) {
    return words
  }

  return words.map((word) => `'${word}'`)
}
