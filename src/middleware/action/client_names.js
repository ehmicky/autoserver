'use strict';

// Sets `clientSummary`, `clientCommandpath`, `clientCommandpaths`,
// `clientCollection` and `clientCollnames`
// Those are the same, but using `clientCollname`, i.e. client-facing collection
// name, which might be different because of `collection.name`
// They are used only in client-facing situations, i.e. in error responses,
// in request method names and in documentation.
const setClientNames = function ({
  schema,
  actions,
  commandpaths,
  collnames,
  summary,
  top,
}) {
  const actionsA = actions
    .map(action => setClientNamesActions({ schema, action, top }));
  const clientVariables = getClientVariables({
    schema,
    collnames,
    commandpaths,
    summary,
    top,
  });

  return { actions: actionsA, ...clientVariables };
};

const setClientNamesActions = function ({
  schema,
  action,
  action: { commandpath, collname },
  top,
}) {
  const clientCollname = getClientCollname({ schema, collname, top });
  const clientCommandpath = getClientCommandpath({ schema, commandpath, top });
  return { ...action, clientCollname, clientCommandpath };
};

const getClientVariables = function ({
  schema,
  collnames,
  commandpaths,
  summary,
  top,
}) {
  const clientCollnames = collnames
    .map(collname => getClientCollname({ schema, collname, top }));
  const clientCommandpaths = commandpaths
    .map(commandpath => getClientCommandpaths({ schema, commandpath, top }));
  const clientSummary = getClientSummary({ schema, summary, top });

  return { clientCollnames, clientCommandpaths, clientSummary };
};

const getClientCommandpaths = function ({ schema, commandpath, top }) {
  const commandpathA = commandpath.split('.');
  const commandpathB = getClientCommandpath({
    schema,
    commandpath: commandpathA,
    top,
  });
  const commandpathC = commandpathB.join('.');
  return commandpathC;
};

const getClientCommandpath = function ({ schema, commandpath, top }) {
  const [collname] = commandpath;
  const clientCollname = getClientCollname({ schema, collname, top });
  const clientCommandpath = [clientCollname, ...commandpath.slice(1)];
  return clientCommandpath;
};

const getClientSummary = function ({ schema, summary, top }) {
  const [, collname, children] = SUMMARY_REGEXP.exec(summary);
  const clientCollname = getClientCollname({ schema, collname, top });
  const clientSummary = `${clientCollname}${children}`;
  return clientSummary;
};

const getClientCollname = function ({
  schema: { collections },
  collname,
  top,
}) {
  // Reuse client-supplied collection name. Otherwise, use first available
  if (top.collname === collname) { return top.clientCollname; }

  const [clientCollname] = collections[collname].name;
  return clientCollname;
};

// Parses `summary`: parent{child} -> ['parent', '{child}']
const SUMMARY_REGEXP = /^([^{]+)(.*)/;

module.exports = {
  setClientNames,
};
