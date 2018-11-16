
module.exports = async function (context, options = {}) {

  const runService = context.app.service('run-operation');
  const operationService = context.app.service('operations');

  const user = context.params.user;

  let orgId = user.current_org;
  let operation = null;

  if (options && options.operation){

    const operationData = options.operation;

    orgId = orgId || operationData.orgId;

    if (operationData._id){
      operation = operationData;
    } 
    else if (operationData.path && orgId){
      await operationService.find({
        query: {
          path: operationData.path,
          org: orgId
        }
      }).then (results => {
        if (results.total === 1) {
          operation = results.data[0];
        }
      });
    }
  }

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

  return context.result = result;
};

