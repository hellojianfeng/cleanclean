
/**
 * this function use to find all user's orgs
 * parameters:
 * data: it is data from create run-api
 * return: 
 * org list with user's roles
 */
module.exports = async function (context, options = {}) {

  //const mongooseClient = context.app.get('mongooseClient');

  const modelParser = require('./model-parser');

  const { user, current_operation_org, current_org } = await modelParser(context,options);

  const orgId = current_operation_org._id || current_org._id;

  const roleService = context.app.service('roles');

  const roleList = [];

  //get all user roles
  await Promise.all(user.roles.map ( async o => {
    if ( o.org_id.equals(orgId)){
      const role = await roleService.get(o.oid);
      roleList.push(role);
    }
  }));
  
  context.result = roleList;

  return context.result;
};

