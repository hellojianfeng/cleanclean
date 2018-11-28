
module.exports = async function (context, options = {}) {

  //const operationData = context.data.data || {};
  //const operation = options.operation;
  const stage = context.data.stage || 'start';

  //const mongooseClient = context.app.get('mongooseClient');
  const parseContext = require('../../../APIs/js/operation-context-parse')(context,options);

  const operation = await parseContext.operation;

  const result = {
    operation: operation.path,
    stage,
    result: {}
  };

  const user_follow_operations = await parseContext.user_follow_operations;
  const org = await parseContext.operation_org;

  if (stage === 'start'){

    result.result.follow_org = org;

    result.result.user_follow_operations = user_follow_operations;
  
    context.result = result;
  }

  return context;
};

