'use strict';

const apiEngine = require('../index');

const startServer = async function () {
  try {
    await apiEngine.compile();
    const { options, servers, exit } = await apiEngine.run();
    return { options, servers, exit };
  } catch (error) {
    const { details, ...rest } = error;
    // eslint-disable-next-line no-console, no-restricted-globals
    console.log(rest);
    // eslint-disable-next-line no-console, no-restricted-globals
    console.log(details);
  }
};

startServer();
