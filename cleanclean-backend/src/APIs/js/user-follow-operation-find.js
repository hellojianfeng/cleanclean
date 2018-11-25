
/**
 * this function use to find all user's orgs
 * parameters:
 * data: it is data from create run-api
 * return: 
 * org list with user's roles
 */
const roleOperationFind = require('./role-operation-find');
const permissionOperationFind = require('./permission-operation-find');
const _ = require('lodash');
module.exports = async function (context, options = {}) {

  //const mongooseClient = context.app.get('mongooseClient');

  const user = context.params.user;

  const parseContext = require('./models-context');

  const { operation, opertion_org,current_org, user_roles } = await parseContext(context,options);

  const followPermissions = [];
  const followOperations = api.getPermissionOperations(permission);

  const operationService = context.app.service('operations');

  const operationList = {};

  //get all roles operation
  await Promise.all(user.roles.map ( async o => {
    if ( o.org.oid.equals(orgId)){
      await roleOperationFind(context, { role_id: o.oid });
      Object.assign( operationList, context.result);
    }
  }));

  //get all permissions operation
  await Promise.all(user.permissions.map ( async o => {
    if (orgId.equals(o.org.oid)){
      await permissionOperationFind(context, { permission_id: o.oid });
      Object.assign( operationList, context.result);
    }
  }));

  //get all user operations
  await Promise.all(user.operations.map ( async o => {
    if (orgId.equals(o.org.oid)){
      const operation = await operationService.get(o.oid);
      operationList[operation.path] = operation;
    }
  }));

  context.result = operationList;

  return context.result;
};

