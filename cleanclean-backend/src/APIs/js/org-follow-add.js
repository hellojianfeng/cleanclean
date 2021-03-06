
/**
 * input format: 
 *  {
 *    org:{ path(or oid) of org },
 *    follow: {
 *      roles: [ path(or oid) of role ],
 *      permissions: [ path(or oid) of permission]
 *    }
 *  }
 */
const _ = require('underscore');
module.exports = async function (context, options = {}) {

  //const mongooseClient = context.app.get('mongooseClient');

  const orgService = context.app.service('orgs');
  //const roleService = context.app.service('roles');
  //const permissionService = context.app.service('permissions');

  const contextParser = require('./context-parser');

  const followData = options && options.follow || context && context.data && context.data.data && context.data.data.follow;

  const { org, current_org } = await contextParser(context,{org: followData.org_path});

  const newRoles = [];
  if (followData && followData.roles){
    for ( const r of followData.roles){
      if (typeof r === 'object' && r.oid && r.path){
        newRoles.push(r);
        continue;
      }
      let role;
      if(typeof r === 'string'){
        const models = await contextParser(context, { role: { path: r, org: current_org }});
        role = models.role;
      }
      if (typeof r === 'object' && r._id && r.path){
        role = r;
      }
      if(role && role._id && role.path){
        newRoles.push({oid: role._id, path: role.path});
      }
    }
  }

  const newPermissions = [];
  if (followData && followData.permissions){
    for ( const p of followData.permissions){
      if (typeof p === 'object' && p.oid && p.path){
        newPermissions.push(p);
        continue;
      }
      let permission;
      if(typeof p === 'string'){
        //const models = await contextParser(context, { permission: { path: p, org: org }});
        const parser = await contextParser(context);
        permission = await parser.f.getPermission({ path: p, org: org });
        //permission = models.permission;
      }
      if (typeof p === 'object' && p._id && p.path){
        permission = p;
      }
      if(permission && permission._id && permission.path){
        newPermissions.push({oid: permission._id, path: permission.path});
      }
    }
  }

  let changed = false;
  if (current_org && newPermissions.length > 0 && newRoles.length > 0){
    let finded = false;
    current_org.follows.map ( o => {
      if ( o.org_id.equals(org._id) ){
        finded = true;
        newRoles.map ( nr => {
          if(!_.contains(o.roles, nr))
          {
            o.roles.push(nr);
            changed = true;
          }
        });
        newPermissions.map ( np => {
          if(!_.contains(o.permissions, np))
          {
            o.permissions.push(np);
            changed = true;
          }
        });
        followData.tags.map ( t => {
          if (!o.tags.include(t)){
            o.tags.push(t);
          }
        });
      }
      return o;
    });

    if(!finded){
      changed = true;
      current_org.follows.push(
        {
          org_id: org._id,
          org_path: org.path,
          roles: newRoles,
          permissions: newPermissions,
          tags: followData.tags
        }
      );
    }
  }

  if (changed){
    await orgService.patch(current_org._id, { follows: current_org.follows });
  }

  return context.result = current_org;
};

