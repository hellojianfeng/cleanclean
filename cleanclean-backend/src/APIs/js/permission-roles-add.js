
/**
 * options format: { operation1: { operation: operation1, roles: []}}
 */
module.exports = async function (context, options = {}) {

  //const mongooseClient = context.app.get('mongooseClient');

  const roleList = [];

  const roleService = context.app.service('roles');
  const permissionService = context.app.service('permissions');

  const parseModels = require('./models-parse');

  const { org, current_org } = await parseModels(context,options);

  let orgId = org && org._id || current_org && current_org._id;

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

    if (typeof item.permission === 'object' && item.permission._id){
      permission = item.permission;
    }

    if (!permission || !permission._id || !permission.path){
      break;
    }

    orgId = orgId || permission.org_id;

    for (const r of item.roles){
      let role = null;
      if ( typeof r === 'string'){
        if(!orgId) break;
        const results = await roleService.find({ query: { path: r, org_id: orgId }});
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

