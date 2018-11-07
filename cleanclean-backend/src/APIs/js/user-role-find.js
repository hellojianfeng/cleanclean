
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
  const { Schema } = mongooseClient;

  const user = context.params.user;

  let orgId = user.current_org;

  if ( options.org_id && options.org_id instanceof mongooseClient.Types.ObjectId){
    orgId = options.org_id;
  }

  const roleService = context.app.service('roles');

  const roleList = {};

  //get all user roles
  await Promise.all(user.roles.map ( async o => {
    if ( o.org.oid.equals(orgId)){
      const role = await roleService.get(o.oid);
      roleList[role.path] = role;
    }
  }));
  
  context.result = roleList;

  return context;
};

