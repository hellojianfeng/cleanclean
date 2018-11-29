
module.exports = async function (context, options = {}) {

  //const operationData = context.data.data || {};
  //const operation = options.operation;
  const action = context.data.action || 'open';

  //const mongooseClient = context.app.get('mongooseClient');
  const parseContext = require('../../../APIs/js/operation-context-parse')(context,options);

  const operation = await parseContext.operation;

  const result = {
    operation: operation.path,
    action,
    result: {}
  };

  const user_follow_operations = await parseContext.user_follow_operations;
  const org = await parseContext.operation_org;

  if (action === 'open'){
    result.result.follow_operations = user_follow_operations;
    result.result.follow_org = org;
    context.result = result;
  }

  return context;
};

