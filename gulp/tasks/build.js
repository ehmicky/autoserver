'use strict'

const { src, dest, series, parallel } = require('gulp')
const { include } = require('gulp-ignore')
const del = require('del')
const yamlToJson = require('gulp-yaml')

const { BUILD, BUILD_DIST } = require('../files')
const { getWatchTask } = require('../utils')
const gulpExeca = require('../exec')

const clean = () => del(BUILD_DIST)

const copy = () =>
  src([`${BUILD}/**`, `!${BUILD}/**/*.{y{,a}ml,js,ts,jsx,tsx}`], {
    dot: true,
  }).pipe(dest(BUILD_DIST))

const babel = () =>
  gulpExeca(
    `babel ${BUILD} --out-dir ${BUILD_DIST} --source-maps --no-comments --minified --retain-lines`,
  )

const yaml = () =>
  src(`${BUILD}/**`, { dot: true })
    .pipe(include(/\.ya?ml$/u))
    .pipe(yamlToJson({ schema: 'JSON_SCHEMA', space: 2 }))
    .pipe(dest(BUILD_DIST))

// eslint-disable-next-line fp/no-mutation
yaml.description = 'Convert YAML files to JSON'

const build = series(clean, parallel(copy, babel, yaml))

// eslint-disable-next-line fp/no-mutation
build.description = 'Build the application'

const buildwatch = getWatchTask({ BUILD: build }, build)

// eslint-disable-next-line fp/no-mutation
buildwatch.description = 'Build the application in watch mode'

module.exports = {
  build,
  buildwatch,
}
