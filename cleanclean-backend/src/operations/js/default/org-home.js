
const userOperationFind = require('../../../APIs/js/user-operation-find');
const everyoneOperationFind = require('../../../APIs/js/everyone-operation-find');
module.exports = async function (context, options = {}) {

  const operationData = context.data.data;
  const operationName = context.data.operation || context.data.name;
  const stage = context.data.stage || 'start';

  const mongooseClient = context.app.get('mongooseClient');

  const user = context.params.user;

  const runOperation = context.app.service('run-operation');

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

  //check org initialized
  const isInitialized = await runOperation.create(
    {
      'operation':'org-initialize',
      'stage':'check'
    }, context.params
  );

  if (!isInitialized){
    result.data.org_is_initialized = false;
    result.data.message = 'org is not initialized, please initialize it first!';
    context.result = result;
    return context;
  }

  if (stage === 'start'){

    const userOperations = await userOperationFind(context);
    const everyoneOperations = await everyoneOperationFind(context);

    const allOperations = Object.assign(userOperations,everyoneOperations);
    //delete operation for org-home
    delete allOperations['org-home'];

    result.data.operations = allOperations;
  
    context.result = result;
  }

  return context;
};

