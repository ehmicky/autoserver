import filterObj from 'filter-obj'
import iconvLite from 'iconv-lite'

import { decodeCharset } from './transform.js'
import { validateCharset } from './validate.js'

// `iconv.encodings` is lazily set, i.e. we need to do this noop
iconvLite.getCodec('binary')

const { encodings } = iconvLite

// Normalize charset, including adding defaults and validating
export const getCharset = function (charset, { format } = {}) {
  const charsetA = addDefaultCharset({ charset, format })

  const charsetB = charsetA.toLowerCase()

  validateCharset({ charset: charsetB, format })

  const charsetC = createInstance({ charset: charsetB, title: charsetA })

  return charsetC
}

// Add default charsets, including the format's default charset
const addDefaultCharset = function ({ charset, format }) {
  const formatCharset = findFormatCharset({ format })

  return charset || formatCharset || DEFAULT_INPUT_CHARSET
}

const DEFAULT_INPUT_CHARSET = 'binary'

const findFormatCharset = function ({ format }) {
  if (format === undefined) {
    return
  }

  return format.getCharset()
}

// Returns a charset adapter object
const createInstance = function ({ charset, title }) {
  const decode = decodeCharset.bind(undefined, charset)

  return { name: charset, title, decode }
}

// Get list of supported charset
export const getCharsets = function () {
  const charsets = filterObj(encodings, isNotAlias)
  const charsetsA = Object.keys(charsets)
  return charsetsA
}

// Remove charsets that are just aliases, to keep return value small
const isNotAlias = function (key, value) {
  return typeof value !== 'string'
}
