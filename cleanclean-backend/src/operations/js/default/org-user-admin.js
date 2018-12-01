
module.exports = async function (context, options = {}) {

  //const operationData = context.data.data || {};
  const operation = options.operation;
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

    result.result.org_users = await contextParser.current_org_users;
    result.result.org_roles = await contextParser.current_org_roles;
    result.result.org_roles = result.result.org_roles.filter( r => {
      return r.path !== 'followone'; // not allow add user directly into this role
    });
    result.result.org_permissions = await contextParser.current_org_permissions;
    result.result.org_operations = await contextParser.current_org_operations;
  
    context.result = result;
  }

  //if not provide role for user, use everybody role
  if (action === 'add-org-user' || action === 'add-user-role'){
    let {role,roles,user} = await modelParser.role(context,operation.data);
    if (role){
      roles.push(role);
    }
    roles = _.uniqBy(roles, r => { return r._id});

    if (roles.length === 0){
      const r = await contextParser.everybody;
      roles.push(r);
    }

    if(user && roles.length > 0){
      const userRoles = await contextParser.user_roles;
      if (userRoles.length === 0){ //if user is not in org, add user as everybody role
        roles = roles.map ( r => {
          return { oid: r._id, path: r.path, org_id: r.org_id, org_path: r.org_path};
        })
      } else {
        roles = roles.concat(userRoles);
        roles = _.uniqBy(roles, r => {
          return r.oid;
        })
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
    if (typeof createUserData === Object && createUserData.email && createUserData.password){
      const user = await userService.create(createUserData);
      if (user){
        user.roles = [ { oid: everybody._id, path: everybody.path, org_id: everybody.org_id, org_path: everybody.org_path}];
        await user.patch(user._id, { roles: user.roles });
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

