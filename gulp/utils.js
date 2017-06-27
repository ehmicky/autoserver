'use strict';


const gulp = require('gulp');
const plumber = require('gulp-plumber');

const files = require('./files.json');


const getFiles = function (type) {
  return Object.entries(files)
    .filter(([, opts]) => opts[type])
    .map(([pattern]) => pattern);
};

const gulpSrc = function (type) {
  const allFiles = getFiles(type);
  return gulp.src(allFiles).pipe(plumber());
};


module.exports = {
  gulpSrc,
};
