'use strict'

const { src, series, parallel, lastRun } = require('gulp')
const jscpd = require('gulp-jscpd')

const FILES = require('../../files')
const { getWatchTask } = require('../../utils')
const gulpExeca = require('../../exec')

const { linksCheck } = require('./linkcheck')

const format = function() {
  const files = [
    ...FILES.JAVASCRIPT,
    ...FILES.MARKDOWN,
    ...FILES.JSON,
    ...FILES.YAML,
  ].join(' ')
  return gulpExeca(`prettier --write --loglevel warn ${files}`)
}

// eslint-disable-next-line fp/no-mutation
format.description = 'Format files using prettier'

// We do not use `gulp-eslint` because it does not support --cache
const lint = function() {
  const files = [...FILES.JAVASCRIPT, ...FILES.MARKDOWN]
    .map(pattern => `"${pattern}"`)
    .join(' ')
  return gulpExeca(
    `eslint ${files} --ignore-path .gitignore --fix --cache --format codeframe --max-warnings 0 --report-unused-disable-directives`,
  )
}

// eslint-disable-next-line fp/no-mutation
lint.description = 'Lint source files'

const dup = function() {
  return src([...FILES.JAVASCRIPT, ...FILES.MARKDOWN]).pipe(
    jscpd({
      verbose: true,
      blame: true,
      'min-lines': 0,
      'min-tokens': 30,
      'skip-comments': true,
    }),
  )
}

// eslint-disable-next-line fp/no-mutation
dup.description = 'Check for code duplication'

const audit = () => gulpExeca('npm audit')

// eslint-disable-next-line fp/no-mutation
audit.description = 'Check for security vulnerabilities'

const outdated = () => gulpExeca('npm outdated')

// eslint-disable-next-line fp/no-mutation
outdated.description = 'Report outdated dependencies'

const links = function() {
  return src(FILES.MARKDOWN, { since: lastRun(links) }).pipe(
    linksCheck({ full: false }),
  )
}

// eslint-disable-next-line fp/no-mutation
links.description =
  'Check for dead links in documentation Markdown files, for local files only'

const linksfull = function() {
  return src(FILES.MARKDOWN, { since: lastRun(links) }).pipe(
    linksCheck({ full: true }),
  )
}

// eslint-disable-next-line fp/no-mutation
linksfull.description =
  'Check for dead links in documentation Markdown files, including HTTP[S] links'

const check = series(format, lint)

const testTask = parallel(check, dup, audit, outdated, links)

// eslint-disable-next-line fp/no-mutation
testTask.description = 'Lint and test the application'

const testwatch = getWatchTask(
  { JAVASCRIPT: [lint, dup], MARKDOWN: [lint, dup, links] },
  testTask,
)

// eslint-disable-next-line fp/no-mutation
testwatch.description = 'Lint and test the application in watch mode'

module.exports = {
  test: testTask,
  testwatch,
  check,
  format,
  lint,
  dup,
  audit,
  outdated,
  links,
  linksfull,
}
