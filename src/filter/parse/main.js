'use strict';

const { getThrowErr } = require('../error');

const { parseOperation } = require('./attrs');
const { optimizeFilter } = require('./optimize');

// Parse `args.filter` and `coll.authorize` format
// Syntax:
//  [                       // Filter. Top-level is either `_or` or `_and`
//    {                     // Attrs
//      attribute_name: 5   // Can use shortcut
//      attribute_name: {   // Name+value: Attr. Value only: Operations
//        _eq: 5,           // Operation
//        _neq: 4
//        _some: {
//          _eq: 3          // Recursive operation
//        }
//      }
//      attribute_name: {
//        nested_attr: {    // Nested attribute
//          _eq: 5
//        }
//      }
//    }
//  ]
const parseFilter = function ({
  filter,
  reason = 'INPUT_VALIDATION',
  prefix = '',
}) {
  if (filter == null) { return; }

  // Top-level array means `_or` alternatives
  const type = Array.isArray(filter) ? '_or' : '_and';

  const throwErr = getThrowErr.bind(null, { reason, prefix });

  const filterA = parseOperation({ type, value: filter, throwErr });

  const filterB = optimizeFilter({ filter: filterA });

  return filterB;
};

module.exports = {
  parseFilter,
};
