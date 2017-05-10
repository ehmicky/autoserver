'use strict';


// Apply system-defined defaults to input, including input arguments
const systemDefaults = async function () {
  return async function systemDefaults(input) {
    const { args, action } = input;

    // order_by defaults to 'id+'
    if (orderByActions.includes(action) && args.order_by === undefined) {
      args.order_by = defaultOrderBy;
    }

    // dry_run defaults to false
    if (dryRunActions.includes(action) && args.dry_run === undefined) {
      args.dry_run = defaultDryRun;
    }

    const response = await this.next(input);
    return response;
  };
};

// Those actions can use argument `order_by`
const orderByActions = ['findMany', 'deleteMany', 'updateMany', 'upsertMany', 'replaceMany', 'createMany'];
const defaultOrderBy = 'id+';

// Those actions can use argument `dry_run`
const dryRunActions = ['deleteOne', 'deleteMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'replaceOne',
  'replaceMany', 'createOne', 'createMany'];
const defaultDryRun = false;


module.exports = {
  systemDefaults,
};
