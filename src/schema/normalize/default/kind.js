'use strict';

// Adds default `model.kind`
const addDefaultKind = function (model) {
  const { kind = defaultKind } = model;

  return { ...model, kind };
};

// By default, include all commands
const defaultKind = ['data', 'search'];

module.exports = {
  addDefaultKind,
};
