
/**
 * this function use to find all user's orgs
 * parameters:
 * data: it is data from create run-api
 * return: 
 * org list with user's roles
 */
const rolePermissionFind = require('./role-permission-find');
module.exports = async function (context, options = {}) {

  const mongooseClient = context.app.get('mongooseClient');

  const user = context.params.user;

  let orgId = user.current_org;

  if ( options.org_id && options.org_id instanceof mongooseClient.Types.ObjectId){
    orgId = options.org_id;
  }

  const permissionService = context.app.service('operations');

  const permissionList = {};

  //get all roles operation
  await Promise.all(user.roles.map ( async o => {
    if ( o.org.oid.equals(orgId)){
      await rolePermissionFind(context, { role_id: o.oid });
      Object.assign( permissionList, context.result);
    }
  }));

  //get all user operations
  await Promise.all(user.permissions.map ( async o => {
    if ( o.org.oid.equals(orgId)){
      const permission = await permissionService.get(o.oid);
      permissionList[permission.path] = permission;
    }
  }));
  
  context.result = permissionList;

  return context.result;
};

