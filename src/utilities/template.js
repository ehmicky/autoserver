'use strict';

const { render } = require('mustache');

const { readFile } = require('./filesystem');

const renderTemplate = async function ({ template, data }) {
  const htmlFile = await readFile(template);
  const htmlString = render(htmlFile, data);
  return htmlString;
};

module.exports = {
  renderTemplate,
};
