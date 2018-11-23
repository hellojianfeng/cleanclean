
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
    const parseModels = require('../APIs/js/models-parse');
    let { org, current_org } = await parseModels(context,options);
    let orgId = org && org._id || current_org && current_org._id;
    let appName = 'default';

    org = org || current_org;

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
        org_id: orgId,
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
          org_id: operation.org_id,
          path: 'everyone'
        }
      });

      const everyoneOperations = finds.total === 1 ? finds.data[0]['operations'] : [];

      everyoneOperations.map ( o => {
        if ( o.oid.equals(operation._id)){
          isAllowOperation = true;
        }
      });

      const tempContext = Object.assign({},context);
      const oUserOperations = await userOperationFind(tempContext);

      const userOperations = Object.values(oUserOperations);

      userOperations.map ( o => {
        if (operation._id.equals(o._id)){
          isAllowOperation = true;
        }
      });

      if(isAllowOperation === false){
        throw new Error('user is not allowed to run operation! operation = '+operationPath);
      }

      const processData = context.data.data || {};
      const operationData = operation.data || {};

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
