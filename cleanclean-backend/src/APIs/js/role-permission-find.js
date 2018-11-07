
/**
 * this function use to find all user's orgs
 * parameters:
 * data: it is data from create run-api
 * return: 
 * org list with user's roles
 */
module.exports = async function (context, options = {}) {

  const mongooseClient = context.app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const roleService = context.app.service('roles');
  const permissionService = context.app.service('permissions');

  let role = null;

  if (options.role_id && options.role_id instanceof mongooseClient.Types.ObjectId){
    role = await roleService.get(options.role_id)
  } else {
    context.result = {};
    return context;
  }

  const permissionList = {};

  //get all role's operations
  await Promise.all(role.permissions.map ( async o => {
    const permission = await permissionService.get(o.oid);
    permissionList[permission.path] = permission;
  }));

  context.result = permissionList;

  return context;
};

