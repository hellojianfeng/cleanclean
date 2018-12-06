
module.exports = async function (context, options = {}) {

  const contextParser = require('./context-parser');

  const runService = context.app.service('run-operation');
  //const operationService = context.app.service('operations');

  //const user = context.params.user;

  const { current_operation, current_org } = await contextParser(context,options);

  const operation = current_operation;

  if (!operation || !operation._id){
    throw new Error('please provide operation id!');
  }

  const result = {
    operation: {
      _id: operation._id,
      path: operation.path
    }
  };

  const findResult = await runService.find({
    query: {
      operation: {
        oid: operation._id
      }
    }
  });
  if (findResult.total === 1){
    result.isCalled = true;
  }

  if(context.data.action && context.data.action.toLowercase() === 'isuserallowed'){
    
  }

  return context.result = result;
};

