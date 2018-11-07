
/**
 * this function use to find all user's orgs
 * parameters:
 * data: it is data from create run-api
 * return: 
 * org list with user's roles
 */
const permissionOperationFind = require('./permission-operation-find');
module.exports = async function (context, options = {}) {

  const mongooseClient = context.app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const roleService = context.app.service('roles');

  let role = null;

  if (options.role_id && options.role_id instanceof mongooseClient.Types.ObjectId){
    role = await roleService.get(options.role_id)
  } else {
    context.result = {};
    return context;
  }

  const operationService = context.app.service('operations');

  const operationList = {};

  //get all permissions operation
  await Promise.all(role.permissions.map ( async o => {
    await permissionOperationFind(context, { permission_id: o.oid });
    Object.assign( operationList, context.result);
  }));

  //get all role's operations
  await Promise.all(role.operations.map ( async o => {
    const operation = await operationService.get(o.oid);
    operationList[operation.path] = operation;
  }));

  context.result = operationList;

  return context;
};

