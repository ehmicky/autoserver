import { wrapAdapters } from '../adapters/wrap.js'

import { FORMAT_ADAPTERS } from './adapters/main.js'
import { getCharset, hasCharset } from './charset.js'
import { parseContent, serializeContent } from './content.js'
import { parseFile, serializeFile } from './file.js'
import { getExtension } from './extensions.js'

const members = ['name', 'title', 'unsafe']

const methods = {
  getCharset,
  hasCharset,
  parseContent,
  serializeContent,
  parseFile,
  serializeFile,
  getExtension,
}

export const formatAdapters = wrapAdapters({
  adapters: FORMAT_ADAPTERS,
  members,
  methods,
  reason: 'FORMAT',
})
