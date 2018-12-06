
/**
 * this function use to add user(s) role(s) in current operation org
 * parameters:
 * data: it is data from operation, like { operation: xxx, data: { users: [ { user: xxx, roles: [...]}]}}
 * return: 
 * user(s) with role(s)
 */
module.exports = async function (context, options = {}) {

  //const mongooseClient = context.app.get('mongooseClient');

  const contextParser = require('./context-parser');
  const findUserRoles = require('./user-role-find');
  const _ = require('lodash');

  const { users, user, roles, everyone_role } = await contextParser(context,options);

  //const orgId = current_operation_org._id || current_org._id;

  const userService = context.app.service('users');

  const userList = users || [];

  if (user){
    if (roles && roles.length > 0){
      userList.push ( { user, roles});
    } else {
      userList.push ( { user, roles: [] });
    }
  }

  for (const ur of userList){
    //find user_roles in current org
    const user_roles = await findUserRoles(context,{user: ur.user});
    //if user has not role in current org, add everyone role for it
    if (user_roles.length === 0 && ur.roles.length === 0){
      ur.roles = [ { oid: everyone_role._id, path: everyone_role.path, org_id: everyone_role.org_id, org_path: everyone_role.path}];
    } else {
      const mRoles = user_roles.concat(ur.roles);
      const uRoles = _.uniqBy(mRoles, e => { return e._id; });
      ur.roles = uRoles.map ( r => {
        return {
          oid: r._id,
          path: r.path,
          org_id: r.org_id,
          org_path: r.org_path
        };
      });
      await userService.patch(ur.user._id,{roles: ur.roles});
    }
  }
  
  return context.result.users = userList;
};

