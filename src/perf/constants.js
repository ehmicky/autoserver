'use strict';

const DEFAULT_CATEGORY = 'default';
// Whitelist categories to avoid typos
const CATEGORIES = [
  'all',
  'default',
  'options',
  'idl',
  'normalize',
  'validate',
  'graphql',
  'middleware',
  'server',
];

module.exports = {
  DEFAULT_CATEGORY,
  CATEGORIES,
};
