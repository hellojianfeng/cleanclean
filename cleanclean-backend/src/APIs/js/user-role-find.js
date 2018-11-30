
/**
 * this function use to find all user's orgs
 * parameters:
 * data: it is data from create run-api
 * return: 
 * org list with user's roles
 */
module.exports = async function (context, options = {}) {

  const mongooseClient = context.app.get('mongooseClient');

  const user = context.params.user;

  const parseModels = require('./models-parse');

  const { org, current_org } = await parseModels(context,options);

  let orgId = org && org._id || current_org && current_org._id;

  const roleService = context.app.service('roles');

  const roleList = {};

  //get all user roles
  await Promise.all(user.roles.map ( async o => {
    if ( o.org_id.equals(orgId)){
      const role = await roleService.get(o.oid);
      roleList[role.path] = role;
    }
  }));
  
  context.result = roleList;

  return context.result;
};

