
module.exports = async function (context, options = {}) {

  const parseModels = require('./models-parse');

  const runService = context.app.service('run-operation');
  //const operationService = context.app.service('operations');

  //const user = context.params.user;

  const { operation, current_org } = await parseModels(context,options);

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

