'use strict';


const ENV = process.env.NODE_ENV === 'dev' ? 'dev' : 'production';


module.exports = {
  ENV,
};
