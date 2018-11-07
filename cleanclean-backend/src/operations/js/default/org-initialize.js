
const orgInitialize = async function (context, options = {}) {
  const orgService = context.app.service('orgs');
  const roleService = context.app.service('roles');
  const operationService = context.app.service('operations');
  const permissionService = context.app.service('permissions');

  const user = context.params.user;

  const orgId = user.current_org;

  const operation = options.operation;

  const org = operation.org;

  const runData = operation.data;

  let stage = context.data.stage || 'start';

  if (stage === 'start'){
    context.result = runData;
    return context;
  }

  if (stage !== 'end'){
    context.result = { message: 'support stages: start | end'};
  }

  //if end stage, run real org initialize

  //add org profiles

  //add permissions
  const permissions = [];
  if(runData.permissions && Array.isArray(runData.permissions)){
    runData.permissions.map( o => {
      o.org = orgId;
      permissions.push(o);
    });

    if (permissions.length > 0) {
      const results = await permissionService.create(permissions);
      if (results.total > 0){
        permissions = results.data;
      }
    }
  }

  //add org roles
  if(runData.roles && Array.isArray(runData.roles)){
    const roles = runData.roles.map( o => {
      o.org = orgId;
      const newPermissions = [];
      o.permissions.map ( op => {
        return permissions.map ( ppo => {
          if (ppo.path === op.path){
            newPermissions.push({
              oid: ppo._id,
              path: ppo.path
            });
          }
        });
      });
      o.permissions = newPermissions;
      return o;
    });

    if (roles.length > 0){
      await roleService.create(roles);
    }
  }

  //add org operations
  if(runData.operations && Array.isArray(runData.operations)){
    await Promise.all(runData.operations.map( async o => {
      o.org = orgId;
      const newOperation = await operationService.create(o);

      //add operation into permission
      await Promise.all(o.permissions.map ( op => {
        return permissions.map ( async ppo => {
          if (ppo.path === op.path){
            //first check whether operation under permission
            const newOperations = ppo.operations;
            const filterResults = newOperation.filter ( 
              oo =>  oo.oid.equals(newOperation._id)
            )
            
            //if not exist in permission, add operation into permission
            if(filterResults.length === 0){
              newOperation.push({
                oid: newOperation._id,
                path: newOperation.path
              })
            }
            await permissionService.patch(ppo._id, {
              operations: newOperations
            })
          }
        });
      }));
    }));
  }

  //add sub-orgs
  if(runData.orgs && Array.isArray(runData.orgs)){
    const orgs = runData.orgs.map( o => {
      o.path = o.path ? org.path + '#' + o.path: org.path + '#'+ o.name;
      return o;
    });

    if (orgs.length > 0) {
      await orgService.create(orgs, context.params);
    }
  }

  //reset current org for user which is changed by add sub org
  context.params.user.current_org = orgId;

  return context;
};

module.exports = orgInitialize;
