
const userOperationFind = require('../../../APIs/js/user-operation-find');
const everyoneOperationFind = require('../../../APIs/js/everyone-operation-find');
const checkOperationStatus = require('../../../APIs/js/check-operation-status');
const contextParser = require('../../../APIs/js/context-parser');
module.exports = async function (context, options = {}) {

  //const operationData = context.data.data || {};
  const operation = options.operation;
  const action = context.data.action || 'open';

  //const mongooseClient = context.app.get('mongooseClient');

  const user = context.params.user;

  const result = {
    operation: operation.path,
    action,
    result: {}
  };

  const {org} = await contextParser(context);

  if (!org) {
    result.result = {
      error: 'not find org!'
    };
    context.result = result;
    return context;
  }else {
    result.result.org = org;
  }
  const userService = context.app.service('users');
  await userService.patch(user._id, { current_org: {oid: org._id, path: org.path}});

  if (action === 'open'){

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

    result.result.operations = allOperations;
  
    context.result = result;
  }

  return context;
};

