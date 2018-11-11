
/**
 * options format: { operation1: { operation: operation1, roles: []}}
 */
module.exports = async function (context, options = {}, returnContext = true) {

  //const mongooseClient = context.app.get('mongooseClient');

  const roleList = [];

  const roleService = context.app.service('roles');
  const operationService = context.app.service('operations');

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
    let operation = null;
    if (typeof item.operation === 'string'){
      if(!orgId) break;
      const results = await operationService.find ({ query: { path: item.operation, org: orgId }});
      if (results.total === 1){
        operation = results.data[0];
      }
    }

    if (typeof item.operation instanceof 'object' && item.operation._id){
      operation = item.operation;
    }

    if (!operation || !operation._id || operation.path){
      break;
    }

    orgId = orgId || operation.org;

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
      role.operations.map ( o => {
        idList.push(o.oid);
      });
      if (!idList.includes(operation._id)){
        role.operations.push({ oid: operation._id, path: operation.path });
      }
      await roleService.patch(role._id, { operations: role.operations});
      roleList.push(role);
    }
  }

  if (returnContext){
    return context;
  }

  return roleList;
};

