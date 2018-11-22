
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
const JsonTools = require('../../utils/JsonTools.js');
const _ = require('underscore');
module.exports = async function (context, options = {}) {

  const mongooseClient = context.app.get('mongooseClient');

  const orgService = context.app.service('orgs');
  const roleService = context.app.service('roles');
  const permissionService = context.app.service('permissions');

  const modelsParse = require('./models-parse');

  const followData = options && options.follow || context && context.data && context.data.data && context.data.data.follow;

  const { org, current_org } = await modelsParse(context,{org: followData.org});

  const newRoles = [];
  if (followData && followData.follow && followData.follow.roles){
    for ( r of followData.follow.roles){
      if (typeof r === 'object' && r.oid && r.path){
        newRoles.push(p);
        continue;
      }
      let role;
      if(typeof r === 'string'){
        const models = await modelsParse(context, { role: { path: r, org: current_org }});
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
  if (followData && followData.follow && followData.follow.permissions){
    for ( p of followData.follow.permissions){
      if (typeof p === 'object' && p.oid && p.path){
        newPermissions.push(p);
        continue;
      }
      let permission;
      if(typeof p === 'string'){
        const models = await modelsParse(context, { permission: { path: p, org: org }});
        permission = models.permission;
      }
      if (typeof p === 'object' && p._id && p.path){
        permission = p
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
      if ( o.oid.equals(org._id) ){
        finded = true;
        newRoles.map ( nr => {
          if(!_.contains(o.follow.roles, nr))
          {
            o.follow.roles.push(nr);
            changed = true;
          }
        });
        newPermissions.map ( np => {
          if(!_.contains(o.follow.permissions, np))
          {
            o.follow.permissions.push(np);
            changed = true;
          }
        })
        followData.tags.map ( t => {
          if (!o.tags.include(t)){
            o.tags.push(t);
          }
        })
      }
      return o;
    });

    if(!finded){
      changed = true;
      current_org.follows.push(
        {
          org: {
            oid: org._id,
            path: org.path
          },
          follow:
          {
            roles: newRoles,
            permissions: newPermissions
          },
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

