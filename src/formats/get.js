import { extname } from 'path'

import { is as isType } from 'type-is'

import { getAdapter } from '../adapters/get.js'

import { formatAdapters } from './wrap.js'

// Retrieve correct format, using MIME type
// Returns undefined if nothing is found
export const getByMime = function ({ mime, safe }) {
  const formats = getFormats({ safe })

  // We try the extensions MIME (e.g. `+json`) after the other MIME types
  // (e.g. `application/jose+json`)
  const format = formats.find(({ mimes }) => mimeMatches({ mime, mimes }))

  if (format !== undefined) {
    return format.wrapped
  }

  const formatA = formats.find(({ mimeExtensions: mimes }) =>
    mimeMatches({ mime, mimes }),
  )

  if (formatA !== undefined) {
    return formatA.wrapped
  }

  throwUnsupportedFormat({ format: mime })
}

// Only the right side of `isType` allow complex types like
// `application/*` or `+json`. However, we might use them both in
// `mime` (e.g. with Content-Type HTTP header `application/*`) or in
// `formats` (e.g. with JSON format `+json`), so we check both sides
const mimeMatches = function ({ mime, mimes = [] }) {
  return mimes.some((mimeA) => isType(mime, mimeA) || isType(mimeA, mime))
}

// Retrieve correct format, using file extension
export const getByExt = function ({ path, safe }) {
  const formats = getFormats({ safe })

  const fileExt = extname(path).slice(1)
  const format = formats.find(({ extensions = [] }) =>
    extensions.includes(fileExt),
  )

  if (format !== undefined) {
    return format.wrapped
  }

  throwUnsupportedFormat({ format: `.${fileExt}` })
}

// Setting `safe` to `true` removes formats that execute code.
// For example, JavaScript can be allowed in config files, but should
// not be allowed in client payloads.
const getFormats = function ({ safe = false }) {
  const formats = Object.values(formatAdapters)

  if (!safe) {
    return formats
  }

  const formatsA = formats.filter(({ unsafe }) => !unsafe)
  return formatsA
}

// Retrieve format adapter
export const getFormat = function (key, { safe = false } = {}) {
  const format = getAdapter({ adapters: formatAdapters, key, name: 'format' })

  const isSafe = !safe || !format.unsafe

  if (isSafe) {
    return format
  }

  throwUnsupportedFormat({ format: format.title })
}

const throwUnsupportedFormat = function ({ format }) {
  throw new Error(`Unsupported format: '${format}'`)
}

// Returns list of allowed MIME types
export const getMimes = function ({ safe } = {}) {
  const formats = getFormats({ safe })
  const mimesA = formats.flatMap(({ mimes = [], mimeExtensions = [] }) => [
    ...mimes,
    ...mimeExtensions,
  ])
  return mimesA
}

// Default format for structured types, and unstructure types
export const DEFAULT_RAW_FORMAT = getFormat('raw')
export const DEFAULT_FORMAT = getFormat('json')
