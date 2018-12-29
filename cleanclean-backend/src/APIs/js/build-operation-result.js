
module.exports = async function (context, options = {}) {

  const contextParser = require('./context-parser');

  const runService = context.app.service('run-operation');

  const { current_operation } = await contextParser(context,options);

  const operation = current_operation;

  if (!operation || !operation._id){
    throw new Error('please provide operation id!');
  }

  const result = {
    operation: {
      _id: operation._id,
      path: operation.path
    },
    result: options
  };

  const findResult = await runService.find({
    query: {
      operation: {
        oid: operation._id
      }
    }
  });
  if (findResult.total > 0){
    result.isCalled = true;
  }

  return context.result = result;
};

