
const userOperationFind = require('../../../APIs/js/user-operation-find');
const everyoneOperationFind = require('../../../APIs/js/everyone-operation-find');
const checkOperationStatus = require('../../../APIs/js/check-operation-status');
module.exports = async function (context, options = {}) {

  const operationData = context.data.data;
  const operationName = context.data.operation || context.data.name;
  const stage = context.data.stage || 'start';

  const mongooseClient = context.app.get('mongooseClient');

  const user = context.params.user;

  const result = {
    page: operationName,
    stage,
    data: {}
  };

  let orgId = operationData.org_id? operationData.org_id:null;

  if (operationData.org && operationData.org._id){
    orgId = operationData.org._id;
  }

  if (operationData.org && operationData.org instanceof mongooseClient.Types.ObjectId){
    orgId = operationData.org;
  }

  if (operationData.org && operationData.org.oid && operationData.org.oid instanceof mongooseClient.Types.ObjectId){
    orgId = operationData.org.oid;
  }

  if (!orgId) {
    result.data = {
      error: 'not find org id!'
    };
    context.result = result;
    return context;
  }
  const userService = context.app.service('users');
  await userService.patch(user._id, { current_org: orgId });

  if (stage === 'start'){

    const userOperations = await userOperationFind(context);
    const everyoneOperations = await everyoneOperationFind(context);

    const allOperations = Object.assign(userOperations,everyoneOperations);
    //delete operation for org-home
    delete allOperations['org-home'];

    if (allOperations['org-initialize']){
      const checkResult = await checkOperationStatus(context,{ operation: allOperations['org-initialize']});
      if (checkResult && checkResult.isCalled === true)
      {
        delete allOperations['org-initialize'];
      }
    }

    result.data.operations = allOperations;
  
    context.result = result;
  }

  return context;
};

