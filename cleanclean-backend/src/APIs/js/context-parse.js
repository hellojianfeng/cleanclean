const _ = require('lodash');
module.exports = async function (context, options={}) {

  let org, operation, role, permission, current_org, follow_org;

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

  context.current = context.current || {};

  const result = {
    get org(){ 
      return (async () => {
        if (context.current.org){
          return context.current.org;
        }
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
        return context.current.org = org;
      })();
    },
    set org(o){
      context.current.org = o;
    },
    get operation(){ 
      return (async ()=>{
        if(context.current.operation){
          return context.current.operation;
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
          if(!finds && operationData.org && operationData.org.oid){
            finds = await operationService.find({query: {path: operationData.path, org_id: operationData.org.oid }});
          }

          if(!finds && operationData.org_id){
            finds = await operationService.find({query: {path: operationData.path, org_id: operationData.org_id }});
          }

          if(!finds && operationData.org && operationData.org.path){
            finds = await operationService.find({query: {path: operationData.path, org_path: operationData.org.path}});
          }

          if(!finds && operationData.org_path){
            finds = await operationService.find({query: {path: operationData.path, org_path: operationData.org_path }});
          }

          if(!finds && operationData.org && typeof operationData.org === 'string'){
            finds = await operationService.find({query: {path: operationData.path, org_path: operationData.org }});
          }
    
          if(finds && finds.total === 1){
            operation = finds.data[0];
          }
        }
        return context.current.operation = operation;
      })();
    },
    set operation(o){
      context.current.operation = o;
    },
    get role(){ 
      return (async () => {
        if (context.current.role){
          return context.current.role;
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

          if(!finds && roleData.org && roleData.org_id){
            finds = await roleService.find({query: {path: roleData.path, org_id: roleData.org_id }});
          }

          if(!finds &&  roleData.org && roleData.org.path){
            finds = await roleService.find({query: {path: roleData.path, org_path: roleData.org.path}});
          }

          if(!finds &&  roleData.org && roleData.org_path){
            finds = await roleService.find({query: {path: roleData.path, org_path: roleData.org_path}});
          }

          if(!finds &&  roleData.org && typeof roleData.org === 'string'){
            finds = await roleService.find({query: {path: roleData.path, org_path: roleData.org}});
          }
    
          if(finds && finds.total === 1){
            role = finds.data[0];
          }
        }
        return context.current.role = role;
      })();
    },
    set role(o){
      context.current.role = o;
    },
    get permission(){ 
      return (async () => {
        if (context.current.permission){
          return context.current.permission;
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

          if(!finds && permissionData.org && permissionData.org_id){
            finds = await permissionService.find({query: {path: permissionData.path, org_id: permissionData.org_id }});
          }

          if(!finds && permissionData.org && permissionData.org.path){
            finds = await permissionService.find({query: {path: permissionData.path, org_path: permissionData.org.path}});
          }

          if(!finds &&  permissionData.org && permissionData.org_path){
            finds = await permissionService.find({query: {path: permissionData.path, org_path: permissionData.org_path}});
          }

          if(!finds &&  permissionData.org && typeof permissionData.org === 'string'){
            finds = await permissionService.find({query: {path: permissionData.path, org_path: permissionData.org}});
          }
    
          if(finds && finds.total === 1){
            permission = finds.data[0];
          }
        }
        return context.current.permission = permission;
      })();
    },
    set permission(o){
      context.current.permission = o;
    },
    get current_org(){ 
      return (async () => {
        if(!context.current.current_org && current_org){
          context.current.current_org = current_org;
        }
        if (context && context.params && context.params.user && context.params.user.current_org && context.params.user.current_org.oid){
          current_org = await orgService.get(context.params.user.current_org.oid);
        }
        return context.current.current_org = current_org;
      })();
    },
    set current_org(o){
      context.current.current_org = o;
    },
    get follow_org(){ 
      return (async () => {
        if(!context.current.follow_org && follow_org){
          context.current.follow_org = follow_org;
        }
        if (context && context.params && context.params.user && context.params.user.follow_org && context.params.user.follow_org.oid){
          follow_org = await orgService.get(context.params.user.follow_org.oid);
        }
        return context.current.follow_org = follow_org;
      })();
    },
    set follow_org(o){
      context.current.follow_org = o;
    },
    get operation_org(){
      return (async (context) => {
        const operation = context.current.operation;
        if (operation && operation.org && context.operation.oid){
          const operationOrg = await operationService.get(operation.oid);
          if (!context.current.operation_org && operationOrg)
          {
            context.current.operation_org = operationOrg;
          }
        } 
        return context.current.operation_org;
      })();
    },

    get everyone(){
      return (async (context) => {
        if (context.current.everyone){
          return context.current.everyone;
        }
        const current_org = this.current_org;
        const finds = await permissionService.find({query:{org_id: current_org._id, path: 'everyone'}});
        if (finds.total === 1){
          context.current.everyone = finds.data[0];
        }
        return context.current.everyone;
      })();
    },

    get everyone_operations(){
      return (async (context) => {

        if (context.current.everyone_operations){
          return context.current.everyone_operations;
        }

        const everyone = this.everyone;

        if(!context.current.everyone_operations && everyone && everyone.operations){
          context.current.everyone_operations = everyone.operations;
        }

        return context.current.everyone_operations;
      })();
    },

    get everybody(){
      return (async (context) => {
        if (context.current.everybody){
          return context.current.everybody;
        }
        const current_org = this.current_org;
        const finds = await roleService.find({query:{org_id: current_org._id, path: 'everyone'}});
        if (finds.total === 1){
          context.current.everybody = finds.data[0];
        }
        return context.current.everybody;
      })();
    },

    get everybody_permissions(){
      return (async (context) => {

        if (context.current.everybody_permissions){
          return context.current.everybody_permissions;
        }

        const everybody = this.everybody;

        if(!context.current.everybody_permissions && everybody && everybody.permissions){
          context.current.everybody_permissions = everybody.permissions; 
        }

        return context.current.everyone_operations;
      })();
    },

    get everybody_operations(){
      return (async (context) => {

        if(context.current.everybody_operations){
          return context.current.everybody_operations;
        }

        const permissions = this.everybody_permissions;

        let operations = operations.concat(this.everybody.operations);

        const idList = permissions.map ( o => {
          return o.oid;
        });

        const oPermissions = permissionService.find({query:{_id:{$in:idList}}});

        oPermissions.map ( o => {
          operations = operations.concat(o.operations);
        });

        if(!context.current.everybody_operations && operations){
          context.current.everybody_operations =  _.uniquby(operations,function(e){return e.oid;});
        }

        return context.current.everybody_operations;
      })();
    },

    get user_roles(){
      const user = context.params.user;
      return user.roles;
    },

    get user_permissions(){
      return (async () => {
        if (context.current.user_permissions){
          return context.current.user_permissions;
        }

        let permissions = context.params.user.permissions;

        const roleIds = context.params.user.roles.map ( o => {
          return o.oid;
        });

        const finds = await roleService.find({query:{_id: {$in: roleIds}}});
        
        finds.data.map ( r => {
          permissions = permissions.concat(r.permissions);
        });
        
        context.current.user_permissions = _.uniqBy(permissions,function(e){return e.oid;});

        return context.current.user_permissions;
      })();
    },

    get user_operations() {
      return (async () => {
        if (context.current.user_operations){
          return context.current.user_operations;
        }

        const user = context.params.user;

        let operations = user.operations;

        const userRoles = this.user_roles;

        userRoles.map ( ur => {
          operations = operations.concat(ur.operations);
        });

        const userPermissions = await this.user_permissions;

        userPermissions.map ( up => {
          operations = operations.concat(up.operations);
        });

        return context.current.user_operations = _.uniqBy(operations,function(e){return e.oid;});
      })();
    },

    get user_follow_permissions(){
      return (async (context) => {
        if(context.current.user_follow_permissions){
          return context.current.user_follow_permissions;
        }
        const follow_org = await this.follow_org;
        const userRoles = await this.user_roles;
        const current_org = await this.current_org;
        const urList = userRoles.map ( ur => {
          return ur._id;
        });
        const everybody = this.everybody;
        urList.push(everybody._id);
        let permissions;

        for (const follow of current_org.follows) {
          if (follow.org && follow.org.oid.equals(follow_org._id)){
            for(const fr of follow.org.follow.roles){
              if (urList.includes(fr.oid)){
                permissions = follow.org.follow.permissions;
                break;
              }
            }
          }
        }
        if(!context.current.user_follow_permissions && permissions ){
          context.current.user_follow_permissions = _.uniquby(permissions,function(e){return e.oid;});
        }
        return context.current.user_permissions;
      })();
    },

    get user_follow_operations(){
      return (async (context) => {
        const followPermissions = this.user_follow_permissions;
        let userOperations = [];
        for (const fp of followPermissions) {
          const opIds = fp.operations.map( o => {
            return o._id;
          });
          const operations = await operationService.find({query:{
            _id: {
              $in: opIds
            }
          }});
          userOperations = userOperations.concat(operations.map ( o=> { return {oid: o._id, path: o.path};}));
        }
        if (!context.current.user_follow_operations && userOperations){
          context.current.user_follow_operations = _.uniqby(userOperations,function(e){return e.oid;});
        }
        return context.current.user_follow_operations;
      })();
    },
  };

  return context.result = result;
};




