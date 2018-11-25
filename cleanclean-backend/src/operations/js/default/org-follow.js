
const parseContext = require('../../../APIs/context-parse');
module.exports = async function (context, options = {}) {

  //const operationData = context.data.data || {};
  const operation = options.operation;
  const stage = context.data.stage || 'start';

  //const mongooseClient = context.app.get('mongooseClient');

  const result = {
    operation: operation.path,
    stage,
    result: {}
  };

  const {user_follow_operations} = await parseContext(context);

  if (stage === 'start'){

    result.result.operations = user_follow_operations;
  
    context.result = result;
  }

  return context;
};

