const _ = require('lodash');
module.exports = function (context, options={}) {

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
  const userService = context.app.service('users');

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
        const contextOperation = context.data.operation;
        const operationApp = context.data.app || 'default';

        if (contextOperation){
          const current_org = context.params.user && context.params.user.current_org;
          const follow_org = context.params.user && context.params.user.follow_org;

          if (typeof contextOperation === 'string'){
            const mongoose = require('mongoose');
            if(mongoose.Types.ObjectId.isValid(contextOperation)){
              operation = await operationService.get(contextOperation);
            } 
            
            if (!operation) {
              const operationData = context.data && context.data.data;
              const orgPath = operationData && operationData.org || follow_org && follow_org.path || current_org && current_org.path;
              if (orgPath){
                const finds = await operationService.find({query:{path: contextOperation ,org_path: orgPath, app: operationApp}});
                if (finds.total === 1){
                  operation = finds.data[0];
                }
              }
            }
          }

          if (typeof contextOperation === 'object'){
            if (contextOperation._id && contextOperation.path){
              operation = contextOperation;
            }
            if (!operation && contextOperation.oid){
              operation = await operationService.get(contextOperation.oid);
            }
          }

          if (operation && operation.path && operation._id && operation.org_id){

            context.current.operation_org = await orgService.get(operation.org_id);            

            if (operation.path === 'org-home'){
              await userService.patch(context.params.user._id, { current_org: { oid: operation.org_id, path: operation.org_path }, follow_org: null});
              context.params.user.current_org = { oid: operation.org_id, path: operation.org_path };
              context.params.user.follow_org = null;
            }
            if (operation.path === 'org-follow'){
              await userService.patch(context.params.user._id, { follow_org: { oid: operation.org_id, path: operation.org_path }});
              context.params.user.follow_org = { oid: operation.org_id, path: operation.org_path };
              //context.params.user.current_org = null;
            }

            return context.current.operation = operation;
          }
        }

        if (operationData && operationData._id && operationData.path){
          operation = operationData;
        }

        if (!operation && operationData && operationData.oid){
          operation = await operationService.get(operationData.oid);
        }

        if (!operation  && operationData && operationData.path){
          let finds;
          if(!finds && operationData.org && operationData.org.oid){
            finds = await operationService.find({query: {path: operationData.path, org_id: operationData.org.oid, app: operationApp }});
          }

          if(!finds && operationData.org_id){
            finds = await operationService.find({query: {path: operationData.path, org_id: operationData.org_id, app: operationApp }});
          }

          if(!finds && operationData.org && operationData.org.path){
            finds = await operationService.find({query: {path: operationData.path, org_path: operationData.org.path, app: operationApp}});
          }

          if(!finds && operationData.org_path){
            finds = await operationService.find({query: {path: operationData.path, org_path: operationData.org_path, app: operationApp }});
          }

          if(!finds && operationData.org && typeof operationData.org === 'string'){
            finds = await operationService.find({query: {path: operationData.path, org_path: operationData.org, app: operationApp }});
          }
    
          if(finds && finds.total === 1){
            operation = finds.data[0];
          }
        }
        return context.current.operation = operation;
      })();
    },
    get operation_org(){
      return (async () => {
        return context.current.operation_org;
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
        if(context.current.current_org){
          return context.current.current_org;
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
        if(context.current.follow_org){
          context.current.follow_org;
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
    get everyone(){
      return (async () => {
        if (context.current.everyone){
          return context.current.everyone;
        }
        const current_org = await this.current_org;
        const finds = await permissionService.find({query:{org_id: current_org._id, path: 'everyone'}});
        if (finds.total === 1){
          context.current.everyone = finds.data[0];
        }
        return context.current.everyone;
      })();
    },

    get everyone_operations(){
      return (async () => {

        if (context.current.everyone_operations){
          return context.current.everyone_operations;
        }

        const everyone = await this.everyone;

        const idList = everyone.operations.map ( o => { return o.oid; });

        const finds = await operationService.find({query:{_id: {$in: idList}}});

        context.current.everyone_operations = finds.data;

        return context.current.everyone_operations;
      })();
    },

    get everybody(){
      return (async () => {
        if (context.current.everybody){
          return context.current.everybody;
        }
        const current_org = await this.current_org;
        const finds = await roleService.find({query:{org_id: current_org._id, path: 'everybody'}});
        if (finds.total === 1){
          context.current.everybody = finds.data[0];
        }
        return context.current.everybody;
      })();
    },

    get everybody_permissions(){
      return (async () => {

        if (context.current.everybody_permissions){
          return context.current.everybody_permissions;
        }

        const everybody = await this.everybody;

        if(!context.current.everybody_permissions && everybody && everybody.permissions){
          const idList = everybody.permissions.map ( p => {
            return p.oid;
          });
          const finds = await permissionService.find({query:{_id:{$in:idList}}});
          context.current.everybody_permissions = finds.data; 
        }

        return context.current.everybody_permissions;
      })();
    },

    get everybody_operations(){
      return (async () => {

        if(context.current.everybody_operations){
          return context.current.everybody_operations;
        }

        let everybody = await this.everybody;

        let operations = everybody.operations;

        const permissions = await this.everybody_permissions;
        
        permissions.map ( p => {
          operations = operations.concat(p.operations);
        });

        const everyone = await this.everyone;
        operations = operations.concat(everyone.operations);

        const idList = operations.map ( o => {
          return o.oid;
        });

        const finds = await operationService.find({query:{_id: {$in: idList}}});

        return context.current.everybody_operations =  finds.data;

      })();
    },

    //user roles in current org
    get user_roles(){
      return (async () => {
        if (context.current.user_roles){
          return context.current.user_roles;
        }

        const current_org = await this.current_org;

        const roleIds = context.params.user.roles.map ( r => {
          return r.oid;
        });

        const finds = await roleService.find({query:{_id: {$in: roleIds}}});
        
        return context.current.user_roles = finds.data.filter ( r => {
          return r.org_path === current_org.path;
        });
      })();
    },

    get user_permissions(){
      return (async () => {
        if (context.current.user_permissions){
          return context.current.user_permissions;
        }

        const current_org = await this.current_org;

        const permissionIds = context.params.user.permissions.map ( p => {
          return p.oid;
        });

        const userRoles = await this.user_roles;

        userRoles.map ( ur => {
          ur.permissions.map ( urp => {
            permissionIds.push(urp.oid);
          });
        });

        const finds = await permissionService.find({query:{_id: {$in: permissionIds}}});

        context.current.user_permissions = finds.data.filter( p => {
          return p.org_path === current_org.path;
        });

        return context.current.user_permissions;
      })();
    },

    get user_operations() {
      return (async () => {
        if (context.current.user_operations){
          return context.current.user_operations;
        }

        const current_org = await this.current_org;

        const user = context.params.user;

        let operations = user.operations;

        const permissions = await this.user_permissions;
      
        permissions.map ( p => {
          operations = operations.concat(p.operations);
        });

        let operationIds = operations.map ( o => {
          return o.oid;
        });

        operationIds = _.uniq(operationIds);

        const finds = await operationService.find({query:{_id:{$in:operationIds}}});

        return context.current.user_operations = finds.data.filter( o => {
          return o.org_path === current_org.path;
        });
      })();
    },

    get user_follow_permissions(){
      return (async () => {
        if(context.current.user_follow_permissions){
          return context.current.user_follow_permissions;
        }
        const follow_org = await this.follow_org;
        const userRoles = await this.user_roles;
        const current_org = await this.current_org;
        const urList = userRoles.map ( ur => {
          return ur.path;
        });
        const everybody = await this.everybody;
        urList.push(everybody.path);
        let permissions = [];

        if(follow_org){
          for (const follow of current_org.follows) {
            if (follow.org_id && follow.org_id.equals(follow_org._id)){
              for(const fr of follow.roles){
                if (urList.includes(fr.path)){
                  permissions = permissions.concat(follow.permissions);
                  break;
                }
              }
            }
          }
        }

        if (permissions.length > 0){
          const idList = permissions.map ( p => {
            return p.oid;
          });
          const finds = await permissionService.find({query:{_id:{$in: idList}}});
          permissions = finds.data;
        }
        return context.current.user_follow_permissions = permissions;
      })();
    },

    get user_follow_operations(){
      return (async () => {
        const followPermissions = await this.user_follow_permissions;
        let opIds = [];
        for (const fp of followPermissions) {
          fp.operations.map( o => {
            return opIds.push(o.oid);
          });
        }
        const finds = await operationService.find({query:{
          _id: {
            $in: opIds
          }
        }});
 
        return context.current.user_follow_operations = finds.data;
      })();
    },
  };

  return context.result = result;
};




