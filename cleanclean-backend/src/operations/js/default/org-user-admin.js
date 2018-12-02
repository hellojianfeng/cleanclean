
module.exports = async function (context, options = {}) {

  //const operationData = context.data.data || {};
  const operation = options.current_operation;
  const action = context.data.action || 'open';
  const contextParser = require('../../../APIs/js/operation-context-parse')(context,options);
  const modelParser = require('../../../APIs/js/model-parser');
  const _ = require('lodash');

  //const mongooseClient = context.app.get('mongooseClient');
  const userService = context.app.service('users');

  //const user = context.params.user;

  const result = {
    operation: operation.path,
    action,
    result: {}
  };

  //open action return org user list
  if (action === 'open'){

    const {current_org_users, current_org_roles, current_org_permissions, current_org_operations} = await modelParser(context,options);

    result.result.org_users = current_org_users;
    result.result.org_permissions = current_org_permissions.filter( r => {
      return r.path !== 'followone'; // not allow add user directly into this role
    });
    result.result.org_roles = current_org_roles;
    result.result.org_operations = current_org_operations;
  
    context.result = result;
  }

  //if not provide role for user, use everyone role
  if (action === 'add-org-user' || action === 'add-user-role'){
    let {role,roles,user,everyone_role} = await modelParser(context,options);
    if (role){
      roles.push(role);
    }
    roles = _.uniqBy(roles, r => { return r._id;});

    if (roles.length === 0){
      roles.push(everyone_role);
    }

    if(user && roles.length > 0){
      const userRoles = await contextParser.user_roles;
      if (userRoles.length === 0){ //if user is not in org, add user as everyone role
        roles = roles.map ( r => {
          return { oid: r._id, path: r.path, org_id: r.org_id, org_path: r.org_path};
        });
      } else {
        roles = roles.concat(userRoles);
        roles = _.uniqBy(roles, r => {
          return r.oid;
        });
      }
      if (roles.length > 0){
        context.params.user.roles = roles;
        await userService.patch(user._id,{roles});
        result.user = context.params.user;
        context.result = result;
      }
    } else {
      throw new Error('no valid user or role(s)!');
    }
  }

  if(action === 'create-org-user'){
    const createUserData = context.data && context.data.data && context.data.data.create_user;
    const {everyone_role} = await modelParser(context,options);
    if (typeof createUserData === Object && createUserData.email && createUserData.password){
      const user = await userService.create(createUserData);
      if (user){
        user.roles = [ { oid: everyone_role._id, path: everyone_role.path, org_id: everyone_role.org_id, org_path: everyone_role.org_path}];
        await user.patch(user._id, { roles: user.roles });
        result.user = user;
        context.result = result;
      }
    }
  }

  if(action === 'find-user'){

  }

  if(action === 'add-user-permission'){

  }

  if(action === 'add-user-operation'){

  }

  return context;
};

