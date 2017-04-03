'use strict';


const { getIdl } = require('../idl');


const processOptions = function (options) {
  const opts = Object.assign({}, options);
  const idl = getIdl({ conf: opts.conf });
  Object.assign(opts, { idl });
  return opts;
};


module.exports = {
  processOptions,
};
