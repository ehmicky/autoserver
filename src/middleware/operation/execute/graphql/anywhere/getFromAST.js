const {
  DocumentNode,
  OperationDefinitionNode,
  FragmentDefinitionNode,
} = require('graphql');

// Checks the document for errors and throws an exception if there is an error.
function checkDocument(doc) {
  if (doc.kind !== 'Document') {
    throw new Error(`Expecting a parsed GraphQL document. Perhaps you need to wrap the query \
string in a "gql" tag? http://docs.apollostack.com/apollo-client/core.html#gql`);
  }

  const numOpDefinitions = doc.definitions.filter((definition) => {
    return definition.kind === 'OperationDefinition';
  }).length;

  // can't have more than one operation definition per query
  if (numOpDefinitions > 1) {
    throw new Error('Queries must have exactly one operation definition.');
  }
}

// Returns the FragmentDefinitions from a particular document as an array
module.exports.getFragmentDefinitions = function (doc) {
  let fragmentDefinitions = doc.definitions.filter((definition) => {
    if (definition.kind === 'FragmentDefinition') {
      return true;
    } else {
      return false;
    }
  });

  return fragmentDefinitions;
}

// Utility function that takes a list of fragment definitions and makes a hash out of them
// that maps the name of the fragment to the fragment definition.
module.exports.createFragmentMap = function (fragments) {
  let symTable;
  fragments.forEach((fragment) => {
    symTable[fragment.name.value] = fragment;
  });

  return symTable;
}

/**
 * Returns the first operation definition found in this document.
 * If no operation definition is found, the first fragment definition will be returned.
 * If no definitions are found, an error will be thrown.
 */
module.exports.getMainDefinition = function (queryDoc) {
  checkDocument(queryDoc);

  let fragmentDefinition;

  for (let definition of queryDoc.definitions) {
    if (definition.kind === 'OperationDefinition') {
      const operation = definition.operation;
      if (operation === 'query' || operation === 'mutation' || operation === 'subscription') {
        return definition;
      }
    }
    if (definition.kind === 'FragmentDefinition' && !fragmentDefinition) {
      // we do this because we want to allow multiple fragment definitions
      // to precede an operation definition.
      fragmentDefinition = definition;
    }
  }

  if (fragmentDefinition) {
    return fragmentDefinition;
  }

  throw new Error('Expected a parsed GraphQL query with a query, mutation, subscription, or a fragment.');
}
