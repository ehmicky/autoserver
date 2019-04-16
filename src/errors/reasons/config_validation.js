const getMessage = function({ path }) {
  return path === undefined ? undefined : `In configuration property '${path}'`
}

// Extra:
//  - path 'VARR'
//  - value VAL
//  - jsonSchema OBJ
//  - suggestions VAL_ARR
const CONFIG_VALIDATION = {
  status: 'SERVER_ERROR',
  title: 'Wrong configuration caught during server startup',
  getMessage,
}

module.exports = {
  CONFIG_VALIDATION,
}
