
/**
 * options format: { operation1: { operation: operation1, roles: []}}
 */
module.exports = async function (context, options = {}) {

  //const mongooseClient = context.app.get('mongooseClient');

  const parseModels = require('./models-parse');

  const roleList = [];

  const roleService = context.app.service('roles');
  const operationService = context.app.service('operations');

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
    let operation = null;
    if (typeof item.operation === 'string'){
      if(!orgId) break;
      const results = await operationService.find ({ query: { path: item.operation, org_id: orgId }});
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

    orgId = orgId || operation.org_id;

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

  context.result = roleList;

  return roleList;
};

