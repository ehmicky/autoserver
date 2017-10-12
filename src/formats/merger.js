'use strict';

const { keyBy } = require('../utilities');

const formats = require('./handlers');

const merger = keyBy(formats);

module.exports = merger;
