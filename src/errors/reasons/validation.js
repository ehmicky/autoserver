'use strict';

// Extra:
//  - kind 'feature|protocol|rpc|argument|data|constraint'
//  - path 'VARR'
//  - value VAL
//  - model OBJ
//  - suggestions VAL_ARR
const VALIDATION = {
  status: 'CLIENT_ERROR',
  title: 'The request syntax or semantics is invalid',
};

module.exports = {
  VALIDATION,
};
