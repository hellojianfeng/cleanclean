
/**
 * options format: { operation1: { operation: operation1, roles: []}}
 */
module.exports = async function (context, options = {}) {

  //const mongooseClient = context.app.get('mongooseClient');

  const roleList = [];

  const roleService = context.app.service('roles');
  const permissionService = context.app.service('permissions');

  let orgId = context && context.params && context.params.user && context.params.user.current_org ? context.params.user.current_org : null;

  if (context && context.org){
    if (context.org._id){
      orgId = context.org._id;
    }
    if (context.org.oid){
      orgId = context.org.oid;
    }
  }
  if (context && context.orgId){
    orgId = context.orgId;
  }

  let list = [];
  if (Array.isArray(options)){
    list = options;
  } else if ( typeof options === 'object'){
    list = Object.values(options);
  } else {
    throw new Error('please provide array or object of options!');
  }

  for ( const item of list){
    let permission = null;
    if (typeof item.permission === 'string'){
      if(!orgId) break;
      const results = await permissionService.find ({ query: { path: item.permission, org: orgId }});
      if (results.total === 1){
        permission = results.data[0];
      }
    }

    if (typeof item.permission instanceof 'object' && item.permission._id){
      permission = item.permission;
    }

    if (!permission || !permission._id || permission.path){
      break;
    }

    orgId = orgId || permission.org;

    for (const r of item.roles){
      let role = null;
      if ( typeof r === 'string'){
        if(!orgId) break;
        const results = await roleService.find({ query: { path: r, org: orgId }});
        if (results.total === 1) {
          role = results.data[0];
        }
      }

      if (typeof r === 'object' && r._id){
        role = r;
      }

      if( ! role || ! role._id){
        break;
      }

      let idList = [];
      role.permissions.map ( o => {
        idList.push(o.oid);
      });
      if (!idList.includes(permission._id)){
        role.permissions.push({ oid: permission._id, path: permission.path });
      }
      await roleService.patch(role._id, { permissions: role.permissions});
      roleList.push(role);
    }
  }

  context.result = roleList;

  return roleList;
};

