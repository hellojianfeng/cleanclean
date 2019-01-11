

module.exports = async function() {

  const contextParser = require('../../APIs/js/context-parser');

  return {
    
    formatScope: async (scope ) => {
      return scope;
    },

    //get listeners for user under some operation and page
    getListeners: async ( context, options = {}) => {
      const { current_page, current_operation, operation_user_roles, operation_user_permissions }= contextParser(context, options);
      const channelService = context.app.service('channels');

      let finds = [];

      const operation = options.operation && operation._id || current_operation && current_operation._id;
      const page = options.page && page.name || current_page && current_page.name;

      if (operation){
        const role_ids = operation_user_roles.map ( o => {
          return o._id;
        })
        const permission_ids = operation_user_permissions.map ( o => {
          return o._id;
        })

        finds = await channelService.find({
          query: {
            "from_scope.operation.oid":operation._id,
            "to_scope":{
              $elemMatch:{
                $and: {
                  $or: {
                    "users": { $exist: false },
                    "users.oid": user._id
                  },
                  $or: {
                    "roles": { $exist: false },
                    "roles.oid:": { $in: role_ids }
                  },
                  $or: {
                    "permissions": { $exist: false },
                    "permissions.oid:": { $in: permission_ids }
                  }
                }
              }
            }
          }
        })
      }

      if (page){
        finds = await channelService.find({
          query: {
            "from_scope.page.name":page.name,
            "to_scope":{
              $elemMatch:{
                $and: {
                  $or: {
                    "users": { $exist: false },
                    "users.oid": user._id
                  }
                }
              }
            }
          }
        })
      }

      if (finds && finds.data){
        return finds.data.map ( o => {
          const type = options.type || o.type;
          return type + "_"+ o.channel_id;
        });
      }

      return finds;
    },

    filterScopeByAllow: async (from_scope, to_scope) => {
      let scopes = [];
      if ( to_scope && from_scope){
        let from_org;
        if (from_scope.operation){
          from_org = from_scope.operation.org_path;
        }
        if (from_scope.page && from_scope.page.name === 'user-home'){
          // user-home page can send notifications to any scope
          scopes = to_scope;
          //to-do: should filter scope according to setting in to_scope, can complete it in future
        }
        to_scope.map ( o => {
          //always allow notification to user-home page, to-do: user-home can only accept some scope notification
          // need to develop later
          if ( o.page && o.page.name === 'user-home'){
            scopes.push(o);
          }
          //if to operation org is same as from operation org, always allow notification each other
          else if (o.operation && o.operation.org_path && o.operation.org_path === from_org){
            scopes.push(o);
          } 
        })
      }

      return scopes;
    }
  }
};

