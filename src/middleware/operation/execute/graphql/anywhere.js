/* eslint-disable */

const {
  DocumentNode,
  SelectionSetNode,
  OperationDefinitionNode,
  FragmentDefinitionNode,
  DirectiveNode,
  FieldNode,
  IntValueNode,
  FloatValueNode,
  StringValueNode,
  BooleanValueNode,
  ObjectValueNode,
  ListValueNode,
  EnumValueNode,
  VariableNode,
  InlineFragmentNode,
  ValueNode,
  SelectionNode,
  ExecutionResult,
  NameNode,
} = require('graphql');

// Based on graphql function from graphql-js:
// graphql(
//   schema: GraphQLSchema,
//   requestString: string,
//   rootValue?: ?any,
//   contextValue?: ?any,
//   variableValues?: ?{[key: string]: any},
//   operationName?: ?string
// ): Promise<GraphQLResult>
const graphql = function (
  resolver,
  document,
  rootValue,
  contextValue,
  variableValues,
) {
  const mainDefinition = getMainDefinition(document);

  const fragments = getFragmentDefinitions(document);
  const fragmentMap = createFragmentMap(fragments);

  const execContext = {
    fragmentMap,
    contextValue,
    variableValues,
    resolver,
  };

  return executeSelectionSet(
    mainDefinition.selectionSet,
    rootValue,
    execContext,
  );
}

const getMainDefinition = function (queryDoc) {
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
const getFragmentDefinitions = function (doc) {
  return doc.definitions.filter((definition) => {
    if (definition.kind === 'FragmentDefinition') {
      return true;
    } else {
      return false;
    }
  });
}

// Utility function that takes a list of fragment definitions and makes a hash out of them
// that maps the name of the fragment to the fragment definition.
const createFragmentMap = function (fragments) {
  let symTable = {};
  fragments.forEach((fragment) => {
    symTable[fragment.name.value] = fragment;
  });

  return symTable;
}

function executeSelectionSet(
  selectionSet,
  rootValue,
  execContext,
) {
  const {
    fragmentMap,
    contextValue,
    variables,
  } = execContext;

  const result = {};

  return promiseOrImmediate(arrayOrPromise(selectionSet.selections.map((selection) => {
    if (!shouldInclude(selection, variables)) {
      // Skip this entirely
      return;
    }

    if (selection.kind === 'Field') {
      const fieldResultOrDeferrable = executeField(
        selection,
        rootValue,
        execContext,
      );

      return promiseOrImmediate(fieldResultOrDeferrable, (fieldResult) => {
        const resultFieldKey = resultKeyNameFromField(selection);

        if (fieldResult !== undefined) {
          if (result[resultFieldKey] === undefined) {
            result[resultFieldKey] = fieldResult;
          } else {
            merge(result[resultFieldKey], fieldResult);
          }
        }
      });
    } else {
      let fragment;

      if (selection.kind === 'InlineFragment') {
        fragment = selection;
      } else {
        // This is a named fragment
        fragment = fragmentMap[selection.name.value];

        if (!fragment) {
          throw new Error(`No fragment named ${selection.name.value}`);
        }
      }

      const typeCondition = fragment.typeCondition.name.value;

      const fragmentResultOrDeferrable = executeSelectionSet(
        fragment.selectionSet,
        rootValue,
        execContext,
      );

      return promiseOrImmediate(fragmentResultOrDeferrable, (fragmentResult) => {
        merge(result, fragmentResult);
      });
    }
  })), () => result);
}

function executeField(
  field,
  rootValue,
  execContext,
) {
  const {
    variableValues: variables,
    contextValue,
    resolver,
  } = execContext;

  const fieldName = field.name.value;
  const args = argumentsObjectFromField(field, variables);

  const info = {
    isLeaf: !field.selectionSet,
    resultKey: resultKeyNameFromField(field),
    directives: getDirectiveInfoFromField(field, variables),
  };

  const resultOrDeferrable = resolver(fieldName, rootValue, args, contextValue, info);

  return promiseOrImmediate(resultOrDeferrable, (result) => {
    // Handle all scalar types here
    if (!field.selectionSet) {
      return result;
    }

    // From here down, the field has a selection set, which means it's trying to
    // query a GraphQLObjectType
    if (result == null) {
      // Basically any field in a GraphQL response can be null, or missing
      return result;
    }

    if (Array.isArray(result)) {
      return executeSubSelectedArray(field, result, execContext);
    }

    // Returned value is an object, and the query has a sub-selection. Recurse.
    return executeSelectionSet(
      field.selectionSet,
      result,
      execContext,
    );
  });
}

function executeSubSelectedArray(
  field,
  result,
  execContext,
) {
  return arrayOrPromise(result.map((item) => {
    // null value in array
    if (item === null) {
      return null;
    }

    // This is a nested array, recurse
    if (Array.isArray(item)) {
      return executeSubSelectedArray(field, item, execContext);
    }

    // This is an object, run the selection set on it
    return executeSelectionSet(
      field.selectionSet,
      item,
      execContext,
    );
  }));
}

function merge(dest, src) {
  if (
    src === null ||
    typeof src !== 'object'
  ) {
    // These types just override whatever was in dest
    return src;
  }

  // Merge sub-objects
  Object.keys(dest).forEach((destKey) => {
    if (src.hasOwnProperty(destKey)) {
      merge(dest[destKey], src[destKey]);
    }
  });

  // Add props only on src
  Object.keys(src).forEach((srcKey) => {
    if (!dest.hasOwnProperty(srcKey)) {
      dest[srcKey] = src[srcKey];
    }
  });
}

function promiseOrImmediate(obj, fn) {
  if (isPromise(obj)) {
    return obj.then(fn);
  } else {
    return fn(obj);
  }
}

function arrayOrPromise(arr) {
  if (arr.some(isPromise)) {
    return Promise.all(arr);
  } else {
    return arr;
  }
}

function isPromise(obj) {
  return obj && typeof obj === 'object' && typeof obj.then === 'function';
}

const getDirectiveInfoFromField = function (field, variables) {
  if (field.directives && field.directives.length) {
    let directiveObj;
    field.directives.forEach((directive) => {
      directiveObj[directive.name.value] = argumentsObjectFromField(directive, variables);
    });
    return directiveObj;
  }
  return null;
}

const shouldInclude = function (selection, variables = {}) {
  if (!selection.directives) {
    return true;
  }

  let res = true;
  selection.directives.some((directive) => {
    // TODO should move this validation to GraphQL validation once that's implemented.
    if (directive.name.value !== 'skip' && directive.name.value !== 'include') {
      // Just don't worry about directives we don't understand
      return;
    }

    //evaluate the "if" argument and skip (i.e. return undefined) if it evaluates to true.
    const directiveArguments = directive.arguments;
    const directiveName = directive.name.value;
    if (directiveArguments.length !== 1) {
      throw new Error(`Incorrect number of arguments for the @${directiveName} directive.`);
    }


    const ifArgument = directive.arguments[0];
    if (!ifArgument.name || ifArgument.name.value !== 'if') {
      throw new Error(`Invalid argument for the @${directiveName} directive.`);
    }

    const ifValue = directive.arguments[0].value;
    let evaledValue = false;
    if (!ifValue || ifValue.kind !== 'BooleanValue') {
      // means it has to be a variable value if this is a valid @skip or @include directive
      if (ifValue.kind !== 'Variable') {
        throw new Error(`Argument for the @${directiveName} directive must be a variable or a bool ean value.`);
      } else {
        evaledValue = variables[ifValue.name.value];
        if (evaledValue === undefined) {
          throw new Error(`Invalid variable referenced in @${directiveName} directive.`);
        }
      }
    } else {
      evaledValue = ifValue.value;
    }

    if (directiveName === 'skip') {
      evaledValue = !evaledValue;
    }

    if (!evaledValue) {
      res = false;
      // Exit this function:
      return true;
    }

    return false;
  });

  return res;
}

/**
 * Returns the first operation definition found in this document.
 * If no operation definition is found, the first fragment definition will be returned.
 * If no definitions are found, an error will be thrown.
 */
const argumentsObjectFromField = function (field, variables) {
  if (field.arguments && field.arguments.length) {
    const argObj = {};
    field.arguments.forEach(({name, value}) => valueToObjectRepresentation(
      argObj, name, value, variables));
    return argObj;
  }

  return null;
}

function valueToObjectRepresentation(argObj, name, value, variables = {}) {
  if (value.kind === 'IntValue' || value.kind === 'FloatValue') {
    argObj[name.value] = Number(value.value);
  } else if (value.kind === 'StringValue' || value.kind === 'BooleanValue' || value.kind === 'EnumValue') {
    argObj[name.value] = value.value;
  } else if (value.kind === 'ObjectValue') {
    const nestedArgObj = {};
    value.fields.map((obj) => valueToObjectRepresentation(nestedArgObj, obj.name, obj.value, variables));
    argObj[name.value] = nestedArgObj;
  } else if (value.kind === 'Variable') {
    const variableValue = variables[value.name.value];
    argObj[name.value] = variableValue;
  } else if (value.kind === 'ListValue') {
    argObj[name.value] = value.values.map((listValue) => {
      const nestedArgArrayObj = {};
      valueToObjectRepresentation(nestedArgArrayObj, name, listValue, variables);
      return nestedArgArrayObj[name.value];
    });
  } else {
    // There are no other types of values we know of, but some might be added later and we want
    // to have a nice error for that case.
    throw new Error(`The inline argument "${name.value}" of kind "${value.kind}" is not \
supported. Use variables instead of inline arguments to overcome this limitation.`);
  }
}

const resultKeyNameFromField = function (field) {
  return field.alias ? field.alias.value : field.name.value;
}

module.exports = {
  graphql,
};
