
/**
 * options format 1: { operation1: { operation: operation, roles: [ {},...]}}
 * options format 2: [ { operation: operation, roles: [ {},...]}]
 */
module.exports = async function (context, options = {}) {

  //const mongooseClient = context.app.get('mongooseClient');

  const parseModels = require('./models-parse');

  const permissionList = [];

  const permissionService = context.app.service('permissions');
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
      if (!orgId){
        break;
      }
      const results = await operationService.find ({ query: { path: item.operation, org_id: orgId }});
      if (results.total === 1){
        operation = results.data[0];
      }
    }

    if (typeof item.operation instanceof 'object' && item.operation._id){
      operation = item.operation;
    }

    if (!operation || !operation._id || !operation.path){
      break;
    }

    orgId = orgId || operation.org_id;

    for (const p of item.permissions){
      let permission = null;
      if ( typeof p === 'string'){
        if (!orgId){
          break;
        }
        const results = await permissionService.find({ query: { path: p, org: orgId }});
        if (results.total === 1) {
          permission = results.data[0];
        }
      }

      if (typeof p === 'object' && p._id){
        permission = p;
      }

      if( ! permission || ! permission._id){
        break;
      }

      let idList = [];
      permission.operations.map ( o => {
        idList.push(o.oid);
      });
      if (!idList.includes(operation._id)){
        permission.operations.push({ oid: operation._id, path: operation.path });
      }
      await permissionService.patch(permission._id, { operations: permission.operations});
      permissionList.push(permission);
    }
  }

  context.result = permissionList;

  return permissionList;
};

