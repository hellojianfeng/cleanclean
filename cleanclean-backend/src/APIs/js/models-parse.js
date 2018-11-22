
module.exports = async function (context, options={}) {

    let org, operation, role, permission;

    let orgData = options.org || context && context.data && context.data.data && context.data.data.org;
    let org_id = options.org_id || context && context.data && context.data.data && context.data.data.org_id;
    let org_path = options.org_path || context && context.data && context.data.data && context.data.data.org_path;
    let operationData = options.operation || context && context.data && context.data.data && context.data.data.operation;
    let roleData = options.role || context && context.data && context.data.data && context.data.data.role;
    let permissionData = options.permission || context && context.data && context.data.data && context.data.data.permission;

    const orgService = context.app.service('orgs');
    const operationService = context.app.service('operations');
    const permissionService = context.app.service('permissions');
    const roleService = context.app.service('roles');

    if (orgData && orgData._id && orgData.path){
      org = orgData;
    }

    if (!org && orgData && orgData.oid){
      org = await orgService.get(orgData.oid);
    }

    if (!org && org_id){
      org = await orgService.get(org_id);
    }

    if (!org && org_path){
      const finds = await orgService.find({query: {path: org_path}});
      if(finds.total === 1){
        org = finds.data[0];
      }
    }

    if (!org && orgData && orgData.path){
      const finds = await orgService.find({query: {path: orgData.path}});
      if(finds.total === 1){
        org = finds.data[0];
      }
    }

    if (!org && typeof orgData === 'string'){
      const finds = await orgService.find({query: {path: orgData}});
      if(finds.total === 1){
        org = finds.data[0];
      }
    }

    //parse operation model
    if (operationData && operationData._id && operationData.path){
      operation = operationData;
    }

    if (!operation && operationData && operationData.oid){
      operation = await operationService.get(operationData.oid);
    }

    if (!operation  && operationData && operationData.path){
      let finds;
      if(operationData.org && operationData.org.oid){
        finds = await operationService.find({query: {path: operationData.path, org_id: operationData.org.oid }});
      }

      if(operationData.org && operationData.org_id){
        finds = await operationService.find({query: {path: operationData.path, org_id: operationData.org_id }});
      }

      if(!operation && operationData.org && operationData.org.path){
        finds = await operationService.find({query: {path: operationData.path, org_path: operationData.org.path}});
      }

      if(operationData.org && operationData.org_path){
        finds = await operationService.find({query: {path: operationData.path, org_path: operationData.org_path }});
      }
      
      if(finds && finds.total === 1){
        operation = finds.data[0];
      }
    }

    //parse role model
    if (roleData && roleData._id && roleData.path){
      role = roleData;
    }

    if (!role && roleData && roleData.oid){
      role = await roleService.get(roleData.oid);
    }

    if (!role && roleData && roleData.path){
      let finds;
      if(roleData.org && roleData.org.oid){
        finds = await roleService.find({query: {path: roleData.path, org_id: roleData.org.oid }});
      }

      if(roleData.org && roleData.org_id){
        finds = await roleService.find({query: {path: roleData.path, org_id: roleData.org_id }});
      }

      if(!role && roleData.org && roleData.org.path){
        finds = await roleService.find({query: {path: roleData.path, org_path: roleData.org.path}});
      }

      if(!role && roleData.org && roleData.org_path){
        finds = await roleService.find({query: {path: roleData.path, org_path: roleData.org_path}});
      }
      
      if(finds && finds.total === 1){
        role = finds.data[0];
      }
    }

    //parse permission model
    if (permissionData && permissionData._id && permissionData.path){
      permission = permissionData;
    }

    if (!permission && permissionData && permissionData.oid){
      permission = await permissionService.get(permissionData.oid);
    }

    if (!permission && permissionData && permissionData.path){
      let finds;
      if(permissionData.org && permissionData.org.oid){
        finds = await permissionService.find({query: {path: permissionData.path, org_id: permissionData.org.oid }});
      }

      if(permissionData.org && permissionData.org_id){
        finds = await permissionService.find({query: {path: permissionData.path, org_id: permissionData.org_id }});
      }

      if(!permission && permissionData.org && permissionData.org.path){
        finds = await permissionService.find({query: {path: permissionData.path, org_path: permissionData.org.path}});
      }

      if(!permission && permissionData.org && permissionData.org_path){
        finds = await permissionService.find({query: {path: permissionData.path, org_path: permissionData.org_path}});
      }
      
      if(finds && finds.total === 1){
        permission = finds.data[0];
      }
    }

    let current_org;
    if (context && context.params && context.params.user && context.params.user.current_org){
      current_org = await orgService.get(context.params.user.current_org);
    }
  
    return context.result = {org, operation,role, permission, current_org};
  };
  
  