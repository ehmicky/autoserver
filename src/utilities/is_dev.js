'use strict';


const isDev = function () {
  return process.env.NODE_ENV === 'dev';
};


module.exports = {
  isDev,
};