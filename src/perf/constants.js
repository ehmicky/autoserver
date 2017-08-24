'use strict';

const DEFAULT_CATEGORY = 'default';
// Whitelist categories to avoid typos
const CATEGORIES = [
  'all',
  'default',
  'main',
  'run_opts',
  'middleware',
  'middleware.final',
  'middleware.timeout',
  'middleware.protocol',
  'middleware.operation',
  'middleware.action',
  'middleware.command',
  'middleware.database',
  'server',
];

module.exports = {
  DEFAULT_CATEGORY,
  CATEGORIES,
};
