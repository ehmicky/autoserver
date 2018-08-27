'use strict'

const { dirname } = require('path')
const { promisify } = require('util')

const through = require('through2')
const linkCheck = require('link-check')
const markdownLinkExtractor = require('markdown-link-extractor')

const { emitError, validateNotStream } = require('../../utils')

const pLinkCheck = promisify(linkCheck)

// Checks for dead links in Markdown files
const linksCheck = function (opts = {}) {
  return through.obj(function fileLinksCheck (file, encoding, done) {
    // eslint-disable-next-line fp/no-this, no-invalid-this
    return singleLinkCheck({ file, done, stream: this, opts })
  })
}

// TODO: through2 calls each file serially.
// Checking links in paralle would be much faster.
const singleLinkCheck = async function ({ file, done, stream, opts }) {
  await linkCheckFile({ file, stream, opts })

  // eslint-disable-next-line fp/no-mutating-methods
  stream.push(file)

  done()
}

const linkCheckFile = async function ({
  file,
  file: { contents, path },
  stream,
  opts,
}) {
  if (file.isNull()) { return }

  validateNotStream({ PLUGIN_NAME, file, stream })

  const content = contents.toString()

  await linkCheckContent({ path, content, stream, opts })
}

const linkCheckContent = async function ({ path, content, stream, opts }) {
  const brokenLinks = await getBrokenLinks({ path, content, opts })
  if (brokenLinks.length === 0) { return }

  const error = getErrorMessages({ brokenLinks, path })
  emitError({ PLUGIN_NAME, stream, error })
}

// Parses Markdown, performs HTTP requests against found links and
// reports result
const getBrokenLinks = async function ({ path, content, opts }) {
  const baseUrl = `file://${dirname(path)}`

  const linksA = markdownLinkExtractor(content)

  const linksB = linksA
    .filter(isUnique)
    .filter(link => isPath({ link, opts }))
  const linksC = linksB.map(link => checkLink({ link, baseUrl }))
  const linksD = await Promise.all(linksC)

  // Only broken links
  const linksE = linksD.filter(link => link !== undefined)

  return linksE
}

const isUnique = function (link, index, links) {
  return !links.some((linkA, indexA) => index > indexA && link === linkA)
}

const isPath = function ({ link, opts: { full = false } }) {
  // `opts.full` defaults to `false`, i.e. only checks local files for speed
  if (full) { return true }

  return !link.startsWith('http:') && !link.startsWith('https:')
}

const checkLink = async function ({ link, baseUrl }) {
  const { status, err } = await pLinkCheck(link, { baseUrl })
  if (status === 'alive') { return }

  return { link, err }
}

const getErrorMessages = function ({ brokenLinks, path }) {
  const messages = brokenLinks
    .map(getErrorMessage)
    .join(`\n${MESSAGE_INDENT}`)
  const messagesA = `Some links in '${path}' are wrong:\n${MESSAGE_INDENT}${messages}`
  return messagesA
}

// Optimized for Gulp output
const MESSAGE_INDENT_LENGTH = 8
const MESSAGE_INDENT = ' '.repeat(MESSAGE_INDENT_LENGTH)

const getErrorMessage = function ({ link, err: { message } }) {
  return `'${link}': ${message}`
}

const PLUGIN_NAME = 'gulp-markdown-link-check'

module.exports = {
  linksCheck,
}
