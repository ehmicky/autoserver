'use strict';


const { getIdl } = require('../idl');


const processOptions = async function (options) {
  const opts = Object.assign({}, options);
  const idl = await getIdl({ conf: opts.conf });
  Object.assign(opts, { idl });
  return opts;
};


module.exports = {
  processOptions,
};
