'use strict';

const { makeImmutable } = require('../utilities');

const GOALS = ['find', 'create', 'replace', 'update', 'delete'];
makeImmutable(GOALS);

module.exports = {
  GOALS,
};
