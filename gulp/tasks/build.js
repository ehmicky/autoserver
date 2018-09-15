'use strict'

const { src, dest, parallel } = require('gulp')
const yamlToJson = require('gulp-yaml')

const FILES = require('../files')
const { execCommand, getWatchTask } = require('../utils')

const format = function() {
  const files = [
    ...FILES.JAVASCRIPT,
    ...FILES.MARKDOWN,
    ...FILES.JSON,
    ...FILES.YAML,
  ].join(' ')
  return execCommand(`prettier --write --loglevel warn ${files}`)
}

// eslint-disable-next-line fp/no-mutation
format.description = 'Format files using prettier'

const yaml = function() {
  return src(FILES.YAML_TO_JSON)
    .pipe(yamlToJson({ schema: 'JSON_SCHEMA', space: 2 }))
    .pipe(dest(({ base }) => base))
}

// eslint-disable-next-line fp/no-mutation
yaml.description = 'Convert YAML files to JSON'

const build = parallel(format, yaml)

// eslint-disable-next-line fp/no-mutation
build.description = 'Build the application'

const buildwatch = getWatchTask(
  {
    JAVASCRIPT: format,
    MARKDOWN: format,
    JSON: format,
    YAML: format,
    YAML_TO_JSON: yaml,
  },
  build,
)

// eslint-disable-next-line fp/no-mutation
buildwatch.description = 'Build the application in watch mode'

module.exports = {
  build,
  buildwatch,
  format,
  yaml,
}
