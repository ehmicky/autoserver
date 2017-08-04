'use strict';

const DEFAULT_CATEGORY = 'default';
// Whitelist categories to avoid typos
const CATEGORIES = [
  'all',
  'default',
  'options',
  'idl',
  'pre_normalize',
  'validate',
  'post_normalize',
  'graphql',
  'middleware',
  'server',
];

module.exports = {
  DEFAULT_CATEGORY,
  CATEGORIES,
};
