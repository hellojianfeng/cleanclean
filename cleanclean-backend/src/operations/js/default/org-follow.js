
module.exports = async function (context, options = {}) {

  //const operationData = context.data.data || {};
  //const operation = options.operation;
  const action = context.data.action || 'open';

  //const mongooseClient = context.app.get('mongooseClient');
  const contextParser = require('../../../APIs/js/context-parser');

  const operation = await parseContext.operation;

  const result = {
    operation: operation.path,
    action,
    result: {}
  };

  const { user_follow_operations, current_operation_org } = await contextParser(context, options);

  if (action === 'open'){
    result.result.follow_operations = user_follow_operations;
    result.result.follow_org = current_operation_org;
    context.result = result;
  }

  return context;
};

