'use strict';

// Sets `clientSummary`, `clientCommandpath`, `clientCommandpaths`,
// `clientCollection` and `clientCollections`
// Those are the same, but using `clientCollname`, i.e. client-facing collection
// name, which might be different because of `collection.name`
// They are used only in client-facing situations, i.e. in error responses,
// in request method names and in documentation.
const setClientNames = function ({
  schema,
  actions,
  commandpaths,
  collections,
  summary,
}) {
  const actionsA = actions
    .map(action => setClientNamesActions({ schema, action }));
  const clientVariables = getClientVariables({
    schema,
    collections,
    commandpaths,
    summary,
  });

  return { actions: actionsA, ...clientVariables };
};

const setClientNamesActions = function ({
  schema,
  action,
  action: { commandpath, collname },
}) {
  const clientCollname = getClientCollname({ schema, collname });
  const clientCommandpath = getClientCommandpath({ schema, commandpath });
  return { ...action, clientCollname, clientCommandpath };
};

const getClientVariables = function ({
  schema,
  collections,
  commandpaths,
  summary,
}) {
  const clientCollections = collections
    .map(collname => getClientCollname({ schema, collname }));
  const clientCommandpaths = commandpaths
    .map(commandpath => getClientCommandpaths({ schema, commandpath }));
  const clientSummary = getClientSummary({ schema, summary });

  return { clientCollections, clientCommandpaths, clientSummary };
};

const getClientCommandpaths = function ({ schema, commandpath }) {
  const commandpathA = commandpath.split('.');
  const commandpathB = getClientCommandpath({
    schema,
    commandpath: commandpathA,
  });
  const commandpathC = commandpathB.join('.');
  return commandpathC;
};

const getClientCommandpath = function ({ schema, commandpath }) {
  const [collname] = commandpath;
  const clientCollname = getClientCollname({ schema, collname });
  const clientCommandpath = [clientCollname, ...commandpath.slice(1)];
  return clientCommandpath;
};

const getClientSummary = function ({ schema, summary }) {
  const [, collname, children] = SUMMARY_REGEXP.exec(summary);
  const clientCollname = getClientCollname({ schema, collname });
  const clientSummary = `${clientCollname}${children}`;
  return clientSummary;
};

const getClientCollname = function ({ schema: { collections }, collname }) {
  const [clientCollname] = collections[collname].name;
  return clientCollname;
};

// Parses `summary`: parent{child} -> ['parent', '{child}']
const SUMMARY_REGEXP = /^([^{]+)(.*)/;

module.exports = {
  setClientNames,
};
