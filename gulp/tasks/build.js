'use strict'

const { src, dest, parallel } = require('gulp')
const yamlToJson = require('gulp-yaml')

const FILES = require('../files')
const { getWatchTask } = require('../utils')

const yaml = function() {
  return src(FILES.YAML_TO_JSON)
    .pipe(yamlToJson({ schema: 'JSON_SCHEMA', space: 2 }))
    .pipe(dest(({ base }) => base))
}

// eslint-disable-next-line fp/no-mutation
yaml.description = 'Convert YAML files to JSON'

const build = parallel(yaml)

// eslint-disable-next-line fp/no-mutation
build.description = 'Build the application'

const buildwatch = getWatchTask({ YAML_TO_JSON: yaml }, build)

// eslint-disable-next-line fp/no-mutation
buildwatch.description = 'Build the application in watch mode'

module.exports = {
  build,
  buildwatch,
  yaml,
}
