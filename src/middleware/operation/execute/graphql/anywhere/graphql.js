const {
  DocumentNode,
  SelectionSetNode,
  FieldNode,
  FragmentDefinitionNode,
  InlineFragmentNode,
} = require('graphql');

const {
  getMainDefinition,
  getFragmentDefinitions,
  createFragmentMap,
  FragmentMap,
} = require('./getFromAST');

const {
  DirectiveInfo,
  shouldInclude,
  getDirectiveInfoFromField,
} = require('./directives');

const {
  isField,
  isInlineFragment,
  resultKeyNameFromField,
  argumentsObjectFromField,
} = require('./storeUtils');

// Based on graphql function from graphql-js:
// graphql(
//   schema: GraphQLSchema,
//   requestString: string,
//   rootValue?: ?any,
//   contextValue?: ?any,
//   variableValues?: ?{[key: string]: any},
//   operationName?: ?string
// ): Promise<GraphQLResult>
module.exports.graphql = function (
  resolver,
  document,
  rootValue,
  contextValue,
  variableValues,
  execOptions = {},
) {
  const mainDefinition = getMainDefinition(document);

  const fragments = getFragmentDefinitions(document);
  const fragmentMap = createFragmentMap(fragments);

  const resultMapper = execOptions.resultMapper;

  // Default matcher always matches all fragments
  const fragmentMatcher = execOptions.fragmentMatcher || (() => true);

  // Default deferrable is a promise
  const deferrableOrImmediate = execOptions.deferrableOrImmediate || promiseOrImmediate;
  const arrayOrDeferrable = execOptions.arrayOrDeferrable || arrayOrPromise;

  const execContext = {
    fragmentMap,
    contextValue,
    variableValues,
    resultMapper,
    resolver,
    fragmentMatcher,
    deferrableOrImmediate,
    arrayOrDeferrable,
  };

  return executeSelectionSet(
    mainDefinition.selectionSet,
    rootValue,
    execContext,
  );
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
    deferrableOrImmediate,
    arrayOrDeferrable,
  } = execContext;

  const result = {};

  return deferrableOrImmediate(arrayOrDeferrable(selectionSet.selections.map((selection) => {
    if (!shouldInclude(selection, variables)) {
      // Skip this entirely
      return;
    }

    if (isField(selection)) {
      const fieldResultOrDeferrable = executeField(
        selection,
        rootValue,
        execContext,
      );

      return deferrableOrImmediate(fieldResultOrDeferrable, (fieldResult) => {
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

      if (isInlineFragment(selection)) {
        fragment = selection;
      } else {
        // This is a named fragment
        fragment = fragmentMap[selection.name.value];

        if (!fragment) {
          throw new Error(`No fragment named ${selection.name.value}`);
        }
      }

      const typeCondition = fragment.typeCondition.name.value;

      return deferrableOrImmediate(execContext.fragmentMatcher(rootValue, typeCondition, contextValue), (fragmentMatcherResult) => {

        if (fragmentMatcherResult) {
          const fragmentResultOrDeferrable = executeSelectionSet(
            fragment.selectionSet,
            rootValue,
            execContext,
          );

          return deferrableOrImmediate(fragmentResultOrDeferrable, (fragmentResult) => {
            merge(result, fragmentResult);
          });

        }

      });
    }
  })), () => {
    if (execContext.resultMapper) {
      return execContext.resultMapper(result, rootValue);
    }

    return result;
  });
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
    deferrableOrImmediate,
  } = execContext;

  const fieldName = field.name.value;
  const args = argumentsObjectFromField(field, variables);

  const info = {
    isLeaf: !field.selectionSet,
    resultKey: resultKeyNameFromField(field),
    directives: getDirectiveInfoFromField(field, variables),
  };

  const resultOrDeferrable = resolver(fieldName, rootValue, args, contextValue, info);

  return deferrableOrImmediate(resultOrDeferrable, (result) => {
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
  return execContext.arrayOrDeferrable(result.map((item) => {
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

function isPromise(obj) {
  return obj && typeof obj === 'object' && typeof obj.then === 'function';
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
