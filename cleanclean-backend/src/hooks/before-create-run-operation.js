
const JsonTools = require('../utils/JsonTools.js');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {

    // const operationService = context.app.service('operations');
    //const orgService = context.app.service('orgs');
    // const userService = context.app.service('users');
    const orgTypeService = context.app.service('org-types');
    const user = context.params.user;

    //const contextParser = require('../APIs/js/operation-context-parse')(context,options);
    const contextParser = require('../APIs/js/context-parser');

    const operationData = context.data.data || {};
    const appName = context.data.app || 'default';

    //const operation = await contextParser.operation;
    const { current_operation, current_operation_org } = await contextParser(context,options);

    if(!current_operation || !current_operation._id){
      throw new Error('no valid operation!');
    }

    const orgType = current_operation_org.type ? await orgTypeService.get(current_operation_org.type.oid) : null;

    //set context data for add run-operation record if needed
    context.data.operation = {
      oid: current_operation._id,
      path: current_operation.path
    };
    context.data.user = {
      oid: user._id
    };

    let isAllowOperation = false;

    const { everyone_role_operations, everyone_permission_operations, user_operations, user_follow_operations } = await contextParser(context, options);

    everyone_permission_operations.map ( o => {
      if ( o._id.equals(current_operation._id)){
        isAllowOperation = true;
      }
    });

    everyone_role_operations.map ( o => {
      if ( o._id.equals(current_operation._id)){
        isAllowOperation = true;
      }
    });

    user_operations.map ( o => {
      if (current_operation._id.equals(o._id)){
        isAllowOperation = true;
      }
    });

    for (const followOperation of user_follow_operations){
      if (followOperation._id.equals(current_operation._id)){
        isAllowOperation = true;
      }
    }

    if(isAllowOperation === false){
      throw new Error('user is not allowed to run operation! operation = ' + current_operation.path);
    }

    const processData = context.data.data || {};
    //const operationData = operation.data || {};

    const typePath = orgType ? orgType.path : 'company';

    const typeJsons = JsonTools.getJsonsFromPathFiles('../operations/data/org-types/'+ typePath, 'org-initialize.json');

    const typeJsonData = JsonTools.mergeObjectInArray(typeJsons,4);

    const orgJsons = JsonTools.getJsonsFromPathFiles('../operations/data/orgs/'+ current_operation_org.path, 'org-initialize.json');

    const orgJsonData = JsonTools.mergeObjectInArray(orgJsons,4);

    const runData = JsonTools.mergeObjects(4,typeJsonData.data,orgJsonData.data,operationData,processData);

    current_operation.data = runData;
    current_operation.org = current_operation_org;

    const doOperation = require('../operations/js/'+ appName + '/' + current_operation.path.toLowerCase());

    await doOperation(context, Object.assign(options, { current_operation, operation: current_operation }));

    const operation = context.params.operation;
    const user = context.params.user;
    const channelService = context.app.service("channels");

    const finds = channelService.find({query:{
      "to_scope.operation":operation.path,
      $exist:{
        "to_scope.users":false,
        "to_scope.roles":false,
        "to_scope.permissions":false
      }}});

    context.result.notifier = {
      listeners: finds.data
    }

    return context;
      
  };
};
