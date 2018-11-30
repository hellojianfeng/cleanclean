
/**
 * this function use to find all user's orgs
 * parameters:
 * data: it is data from create run-api
 * return: 
 * org list with user's roles
 */
const roleOperationFind = require('./role-operation-find');
const permissionOperationFind = require('./permission-operation-find');
module.exports = async function (context, options = {}) {

  //const mongooseClient = context.app.get('mongooseClient');

  const user = context.params.user;

  const parseModels = require('./models-parse');

  const { org, current_org } = await parseModels(context,options);

  let orgId = org && org._id || current_org && current_org._id;

  const operationService = context.app.service('operations');

  const operationList = {};

  //get all roles operation
  await Promise.all(user.roles.map ( async o => {
    if ( o.org_id.equals(orgId)){
      await roleOperationFind(context, { role_id: o.oid });
      Object.assign( operationList, context.result);
    }
  }));

  //get all permissions operation
  await Promise.all(user.permissions.map ( async o => {
    if (orgId.equals(o.org_id)){
      await permissionOperationFind(context, { permission_id: o.oid });
      Object.assign( operationList, context.result);
    }
  }));

  //get all user operations
  await Promise.all(user.operations.map ( async o => {
    if (orgId.equals(o.org_id)){
      const operation = await operationService.get(o.oid);
      operationList[operation.path] = operation;
    }
  }));

  context.result = operationList;

  return context.result;
};

