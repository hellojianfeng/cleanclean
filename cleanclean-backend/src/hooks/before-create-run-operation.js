
const JsonTools = require('../utils/JsonTools.js');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {

    // const operationService = context.app.service('operations');
    // const orgService = context.app.service('orgs');
    // const userService = context.app.service('users');
    const orgTypeService = context.app.service('org-types');
    const user = context.params.user;

    const contextParser = require('../APIs/js/operation-context-parse')(context,options);

    const operationData = context.data.data || {};
    const appName = context.data.app || 'default';

    const operation = await contextParser.operation;

    let org = await contextParser.org || await contextParser.follow_org || await contextParser.current_org;

    const orgType = org.type ? await orgTypeService.get(org.type.oid) : null;

    //set context data for add run-operation record if needed
    context.data.operation = {
      oid: operation._id,
      path: operation.path
    };
    context.data.user = {
      oid: user._id
    };

    let isAllowOperation = false;

    const everybody_operations = await contextParser.everybody_operations;
    const everyone_operations = await contextParser.everyone_operations;
    const user_operations = await contextParser.user_operations;
    const user_follow_operations = await contextParser.user_follow_operations;

    everyone_operations.map ( o => {
      if ( o._id.equals(operation._id)){
        isAllowOperation = true;
      }
    });

    everybody_operations.map ( o => {
      if ( o._id.equals(operation._id)){
        isAllowOperation = true;
      }
    });

    user_operations.map ( o => {
      if (operation._id.equals(o._id)){
        isAllowOperation = true;
      }
    });

    for (const followOperation of user_follow_operations){
      if (followOperation._id.equals(operation._id)){
        isAllowOperation = true;
      }
    }

    if(isAllowOperation === false){
      throw new Error('user is not allowed to run operation! operation = '+operation.path);
    }

    const processData = context.data.data || {};
    //const operationData = operation.data || {};

    const typePath = orgType ? orgType.path : 'company';

    const typeJsons = JsonTools.getJsonsFromPathFiles('../operations/data/org-types/'+ typePath, 'org-initialize.json');

    const typeJsonData = JsonTools.mergeObjectInArray(typeJsons,4);

    const orgJsons = JsonTools.getJsonsFromPathFiles('../operations/data/orgs/'+ org.path, 'org-initialize.json');

    const orgJsonData = JsonTools.mergeObjectInArray(orgJsons,4);

    const runData = JsonTools.mergeObjects(4,typeJsonData.data,orgJsonData.data,operationData,processData);

    operation.data = runData;
    operation.org = org;

    const doOperation = require('../operations/js/'+ appName + '/' + operation.path.toLowerCase());

    return doOperation(context, Object.assign(options, { operation }));
      
  };
};
