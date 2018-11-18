
/**
 * input format: 
 * {
 *    followName: {
 *      "org_path": {
 *        "path": xxxx,
 *        "follow": {
 *          "roles": { rolePath: { oid: roleid, path: rolePath}},
 *          "permissions": { permissionPath: { oid: permissionId, path: permissionPath }}
 *        }
 *      }
 *    }
 * }
 * 
 * result in org collection of orgs property
 * {
 *    followName: {
 *      "org_path": {
 *        "oid":xxxx
 *        "path": xxxx,
 *        "follow": {
 *          "roles": [oid of role],
 *          "permissions": [oid of permission]
 *        }
 *      }
 *    }
 * }
 */
const JsonTools = require('../../utils/JsonTools.js');
const _ = require('underscore');
module.exports = async function (context, options = {}) {

  const mongooseClient = context.app.get('mongooseClient');

  const orgService = context.app.service('orgs');
  const roleService = context.app.service('roles');
  const permissionService = context.app.service('permissions');

  let org = null;
  let orgData = null;

  if (context.data.data && context.data.data.org){
    orgData = context.data.data.org;
  }

  if (options.org){
    orgData = context.data.org;
  }

  if (orgData && typeof orgData === 'object'){
    if (orgData._id && orgData.path){
      org = orgData;
    }

    if(!org && orgData.oid){
      org = await orgService.get(orgData.oid);
    }

    if(!org && orgData.path){
      const finds =  await orgService.find({query: { path: orgData.path }});
      if (finds.total === 1){
        org = finds.data[0];
      }
    }
  }
  
  if(!org && context && context.params && context.params.user && context.params.user.current_org){
    org = await orgService.get(context.params.user.current_org);
  } 

  if (!org){
    throw new Error('no valid org!');
  }

  let inputFollows = null;

  if(options.follows){
    inputFollows = options.follows;
  }

  if (!inputFollows && context.data && context.data.follows){
    inputFollows = context.data.follows;
  }

  if(!inputFollows){
    throw new Error('no valid input orgs!');
  }

  const orgFollows = org.follows;
  const outFollows = [];

  const followNameList = orgFollows.map ( o => {
    return o.name;
  });

  for ( const inputFollow of inputFollows){
    if (!nameList.includes(inputFollow.name)){

    } else {
      const orgFollow = orgFollows.map ( o => {
        if (o.name === inputFollow.name){
          return o;
        }
      });
      const orgList = orgFollow['orgs'].map( org => {
        return org.org.path;
      });

      for (const inputFollowOrg of inputFollow['orgs']){
        if( !orgList.includes(inputFollowOrg.org.path)){
          
        } else {
          const orgFollowOrg = orgFollow.orgs.map ( o => {
            if ( o.path === inputFollowOrg.path){
              return o;
            }
          });
          const roleList = orgFollowOrg['follow']['roles'].map( o=> {
            return o.path;
          });
          const permissionList = orgFollowOrg['follow']['permissions'].map( o=> {
            return o.path;
          });
          for (const inputFollowRole of inputFollowOrg['follow']['roles']){
            if (!roleList.includes(inputFollowRole.path)){

            } else {

            }
          }
        }
      }
    }
  }

  for(const followName of Object.keys(inputFollows)){
    const orgs = inputFollows[followName];
    for(const orgData of Object.values(orgs)){
      if (orgData.path && orgData.follow && orgData.follow.roles && orgData.follow.permissions){
        if (!orgData.oid && orgData.path){
          const results = await orgService.find({query: { path: org.path}});
          if (results.total === 1){
            orgData.oid = results.data[0]._id;
          }
        }
        const roles = Object.assign({},orgData.follow.roles);
        orgData.follow.roles = {};
        for(const r of Object.values(roles)){
          let rolePath, role;
          if(typeof r === 'object' && r.oid && r.path){
            orgData.follow.roles[r.path] = r;
            continue;
          } else if (typeof r === 'object' && r.path){
            rolePath = r.path;
          } else if (r instanceof mongooseClient.Types.ObjectId){
            role = await roleService.get(r);
            orgData.follow.roles[role.path] = {oid: role._id, path: role.path};
            continue;
          } else if (typeof r === 'string' ){
            rolePath = r;
          } else { continue;}

          if (rolePath){
            const findResult = await roleService.find({query: { org: org._id, path: rolePath}});
            if ( findResult.total === 1){
              role = findResult.data[0];
              orgData.follow.roles[role.path] = {oid: role._id, path: role.path};
              continue;
            }
          }
        }
        orgData.follow.roles = roles;
        const permissions = Object.assign({},orgData.follow.permissions);
        orgData.follow.permissions = {};
        for(const p of Object.values(permissions)){
          let permissionPath, permission;
          if(typeof p === 'object' && p.oid && p.path){
            orgData.follow.permissions[p.path] = p;
            continue;
          } else if (typeof p === 'object' && p.path){
            permissionPath = p.path;
          } else if (p instanceof mongooseClient.Types.ObjectId){
            permission = await permissionService.get(p);
            orgData.follow.permissions[permission.path] = {oid: permission._id, path: permission.path};
            continue;
          } else if (typeof p === 'string' ){
            permissionPath = p;
          } else { continue;}

          if (permissionPath){
            const findResult = await permissionService.find({query: { org: orgData.oid, path: permissionPath}});
            if ( findResult.total === 1){
              permission = findResult.data[0];
              orgData.follow.permissions[permission.path]= {oid: permission._id, path: permission.path};
              continue;
            }
          }
        }

        orgData.follow.permissions = permissions;
      } else {
        continue;
      }
    }
  }

  org.follows = JsonTools.mergeObject(org.follows, inputFollows, 4);

  const patchResult = orgService.patch(org._id, { follows: org.follows });

  context.result = { api: 'org-follow-add', result: { apiResult: patchResult, follows: org.follows } };

  return org.follows;
};

