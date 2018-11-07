
/**
 * this function use to find all user's orgs
 * parameters:
 * data: it is data from create run-api
 * return: 
 * org list with user's roles
 */
module.exports = async function (context, options = {}) {

  const mongooseClient = context.app.get('mongooseClient');
  //const { Schema } = mongooseClient;

  const permissionService = context.app.service('permissions');

  let permission = null;

  if (options.permission_id && options.permission_id instanceof mongooseClient.Types.ObjectId){
    permission = await permissionService.get(options.permission_id)
  } else {
    context.result = {};
    return context;
  }

  const operationService = context.app.service('operations');

  const operationList = {};

  //get all permission's operations
  await Promise.all(permission.operations.map ( async o => {
    const operation = await operationService.get(o.oid);
    operationList[operation.path] = operation;
  }));

  context.result = operationList;

  return context;
};

