
const JsonTools = require('../utils/JsonTools.js');
const userOperationFind = require('../APIs/js/user-operation-find');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {

    const operationService = context.app.service('operations');
    const orgService = context.app.service('orgs');
    const orgTypeService = context.app.service('org-types');
    const user = context.params.user;

    //get operation first
    const operationPath = context.data.operation;
    const orgId = user.current_org;
    const org = await orgService.get(orgId);
    let appName = 'default';

    let orgType = null;

    if(org.type){
      orgType = await orgTypeService.get(org.type.oid);
    }

    if(context.data.app){
      appName = context.data.app;
    }

    if(!operationPath){
      throw new Error('must provide operation path!');
    }

    if(!orgId){
      throw new Error('not find current org for user!');
    }

    return await operationService.find({
      query: {
        path: operationPath,
        org: orgId.toString(),
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

      context.data.operation = {
        oid: operation._id
      };
      context.data.user = {
        oid: user._id
      };

      let isAllowOperation = false;

      const permissionService = context.app.service('permissions');

      const finds = await permissionService.find({
        query: {
          org: operation.org,
          path: 'everyone'
        }
      });

      const everyoneOperations = finds.total === 1 ? finds.data[0]['operations'] : [];

      everyoneOperations.map ( o => {
        if ( o.oid.equals(operation._id)){
          isAllowOperation = true;
        }
      })

      const tempContext = Object.assign({},context);
      await userOperationFind(tempContext);

      const userOperations = Object.values(tempContext.result);

      userOperations.map ( o => {
        if (operation._id.equals(o._id)){
          isAllowOperation = true;
        }
      });

      if(isAllowOperation === false){
        throw new Error('user is not allowed to run operation! operation = '+operationPath);
      }

      const processData = context.data.data || {};
      const orgData = org.data || {};
      const operationData = operation.data || {};
      const readyToMergeList = [];

      const typePath = orgType ? orgType.path : 'company';

      const typeJsons = JsonTools.getJsonsFromPathFiles('../operations/data/org-types/'+ typePath, 'org-initialize.json');

      typeJsonData = JsonTools.mergeObjectInArray(typeJsons,4);

      const orgJsons = JsonTools.getJsonsFromPathFiles('../operations/data/orgs/'+ org.path, 'org-initialize.json');

      orgJsonData = JsonTools.mergeObjectInArray(orgJsons,4);

      const runData = JsonTools.mergeObjects(4,typeJsonData.data,orgJsonData.data,operationData,processData)

      operation.data = runData;
      operation.org = org;

      const doOperation = require('../operations/js/'+ appName + '/' + operation.path.toLowerCase());

      return doOperation(context, Object.assign(options, { operation }));
      
    });

    return context;
  };
};
