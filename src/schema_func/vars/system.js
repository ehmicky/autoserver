'use strict';

const { protocolHandlers } = require('../../protocols');
const { rpcHandlers } = require('../../rpc');
const { COMMAND_TYPES } = require('../../constants');

const protocols = Object.keys(protocolHandlers);
const rpcs = Object.keys(rpcHandlers);

// System variables that are always present
// We need to specify their `type` and `isArray` for `coll.authorize`
// validation
const SYSTEM_VARS = {
  protocol: { type: 'string', validation: { enum: protocols } },
  timestamp: { type: 'string' },
  ip: { type: 'string' },
  requestid: { type: 'string' },
  rpc: { type: 'string', validation: { enum: rpcs } },
  collection: { type: 'string' },
  command: {
    type: 'string',
    validation: {
      enum: COMMAND_TYPES,
      // With patch authorization, one can simulate find and replace
      // authorization and vice-versa. So to avoid mistakes, we force
      // specifying them together.
      requires: [
        [['patch'], ['find']],
        [['upsert'], ['find']],
        [['create'], ['find']],
        [['delete'], ['find']],
        [['upsert'], ['create', 'patch']],
        [['create', 'patch'], ['upsert']],
      ],
    },
  },
  args: { type: 'dynamic' },
  params: { type: 'dynamic' },
};

// System variables that are not always present
const TEMP_SYSTEM_VARS = [
  'arg1',
  'arg2',
  'arg3',
  'arg4',
  'arg5',
  'arg6',
  'arg7',
  'arg8',
  'arg9',
  'model',
  'val',
  'previousmodel',
  'previousval',
  'arg',
  'type',
];

module.exports = {
  SYSTEM_VARS,
  TEMP_SYSTEM_VARS,
};
