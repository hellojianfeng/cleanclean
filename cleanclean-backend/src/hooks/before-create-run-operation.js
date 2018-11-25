
const JsonTools = require('../utils/JsonTools.js');
const userOperationFind = require('../APIs/js/user-operation-find');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {

    const operationService = context.app.service('operations');
    const orgService = context.app.service('orgs');
    const userService = context.app.service('users');
    const orgTypeService = context.app.service('org-types');
    const user = context.params.user;

    //get operation first
    const operationPath = context.data.operation;

    if(!operationPath){
      throw new Error('must provide operation path!');
    }

    const operationData = context.data.data || {};
    //const parseModels = require('../APIs/js/models-parse');
    //let { org, current_org } = await parseModels(context,options);
    let org = user.current_org;
    if (operationPath === 'org-home' || operationPath === 'follow-home'){
      if (operationData && operationData.org){
        const orgData = operationData.org;
        let orgPath;
        if (typeof orgData === 'object'){
          if(orgData.oid){
            org = await orgService.get(orgData.oid);
          }
          if(orgData.path){
            orgPath = orgData.path;
          }
        }
        if (typeof orgData === 'string'){
          orgPath = orgData;
        }
        if (!org && orgPath){
          const finds = await orgService.find({query:{path:orgPath}});
          if(finds.total === 1){
            org = finds.data[0];
          }
        }
      }
    }

    if (org && org.oid && !org._id){
      org = await orgService.get(org.oid);
    }

    if(!org){
      throw new Error('not find current org for user!');
    }
    
    let appName = 'default';

    let orgType = null;

    if(org.type){
      orgType = await orgTypeService.get(org.type.oid);
    }

    if(context.data.app){
      appName = context.data.app;
    }

    return await operationService.find({
      query: {
        path: operationPath,
        org_id: org._id,
        app: appName
      }
    }).then ( async results => {
      if (results.total < 1){
        throw new Error('fail to find operation!, operation = '+operationPath);
      }
      if (results.total > 1){
        throw new Error('find too many operations, operation = '+operationPath);
      }

      const operation = results.data[0];

      if (operation.path === 'org-home'){
        await userService.patch(user._id, {
          current_org: { oid: operation.org_id, path: operation.org_path },
          follow_org: null
        });
        context.params.user.current_org = { oid: operation.org_id, path: operation.org_path };
        context.params.user.follow_org = null;
      }

      if (operation.path === 'follow-home'){
        await userService.patch(user._id, {follow_org: { oid: operation.org_id, path: operation.org_path }});
        context.params.user.follow_org = { oid: operation.org_id, path: operation.org_path };
      }

      //set context data for add run-operation record if needed
      context.data.operation = {
        oid: operation._id,
        path: operation.path
      };
      context.data.user = {
        oid: user._id
      };

      let isAllowOperation = false;

      const contextParse = require('../APIs/js/context-parse');

      //set active operation
      contextParse.operation = operation;

      const parsedContext =await contextParse(context,options);
      const user_operations = await parsedContext.user_operations;

      const { everyone_operations, everybody_operations, user_follow_operations } = await contextParse(context,options);
  
      everyone_operations.map ( o => {
        if ( o.oid.equals(operation._id)){
          isAllowOperation = true;
        }
      });

      everybody_operations.map ( o => {
        if ( o.oid.equals(operation._id)){
          isAllowOperation = true;
        }
      });

      user_operations.map ( o => {
        if (operation._id.equals(o._id)){
          isAllowOperation = true;
        }
      });

      for (const followOperation of user_follow_operations){
        if (followOperation.oid.equals(operation._id)){
          isAllowOperation = true;
        }
      }

      if(isAllowOperation === false){
        throw new Error('user is not allowed to run operation! operation = '+operationPath);
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
      
    });
  };
};
