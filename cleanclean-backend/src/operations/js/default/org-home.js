
const userOperationFind = require('../../../APIs/js/user-operation-find');
const everyoneOperationFind = require('../../../APIs/js/everyone-operation-find');
const checkOperationStatus = require('../../../APIs/js/check-operation-status');
const modelsParse = require('../../../APIs/js/models-parse');
module.exports = async function (context, options = {}) {

  const operationData = context.data.data || {};
  const operationName = context.data.operation || context.data.name;
  const stage = context.data.stage || 'start';

  const mongooseClient = context.app.get('mongooseClient');

  const user = context.params.user;

  const result = {
    page: operationName,
    stage,
    data: {}
  };

  const {org} = await modelsParse(context);

  if (!org) {
    result.data = {
      error: 'not find org!'
    };
    context.result = result;
    return context;
  }
  const userService = context.app.service('users');
  await userService.patch(user._id, { current_org: org._id });

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

