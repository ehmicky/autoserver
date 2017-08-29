'use strict';

const DEFAULT_CATEGORY = 'default';
// Whitelist categories to avoid typos
// Order matters, as console printing uses it for sorting
const CATEGORIES = [
  'cli',
  'default',
  'main',
  'run_opts',
  'idl',
  'HTTP',
  'middleware',
  'time',
  'protocol',
  'operation',
  'action',
  'command',
  'database',
  'final',
];

module.exports = {
  DEFAULT_CATEGORY,
  CATEGORIES,
};
