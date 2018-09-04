'use strict'

// Extra:
//  - path 'VARR'
//  - value VAL
//  - jsonSchema OBJ
//  - suggestions VAL_ARR
const CONFIG_VALIDATION = {
  status: 'SERVER_ERROR',
  title: 'Wrong configuration caught during server startup',
  getMessage: ({ path }) =>
    (path === undefined ? undefined : `In configuration property '${path}'`),
}

module.exports = {
  CONFIG_VALIDATION,
}
