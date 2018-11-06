const fileTool = require('../utils/file.js');

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

    await operationService.find({
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

      const roleService = context.app.service('roles');

      await Promise.all(user.roles.map ( async ur => {
        if( ur.org.oid.equals(orgId)){
          const role = await roleService.get(ur.oid);
          operation.permissions.map( op => {
            //always allow everyone operation to run
            if (op.path === 'everyone') {
              isAllowOperation = true;
            } else {
              role.permissions.map ( rp => {
                if (rp.oid.equals(op.oid)){
                  isAllowOperation = true;
                }
              });
            }
          });
        }
      }));

      if(isAllowOperation === false){
        throw new Error('user is not allowed to run operation! operation = '+operationPath);
      }

      const processData = context.data.data || {};
      const orgData = org.data || {};
      const operationData = operation.data || {};

      const typePath = orgType ? orgType.path : 'company';

      let orgTypeJsonData = {};
      let orgJsonData = {};

      const orgTypeJsonDataPath = fileTool.getTailFileInDotFolder('src/operations/data/org-types/'+ typePath, 'org-initialize.json');
      
      if(orgTypeJsonDataPath){
        orgTypeJsonData = require(orgTypeJsonDataPath.replace(/^src/,'..'));
      }

      const orgJsonDataPath = fileTool.getTailFileInDotFolder('src/operations/data/orgs/'+ org.path, 'org-initialize.json','#');
      
      if(orgJsonDataPath){
        orgJsonData = require(orgJsonDataPath.replace(/^src/,'..'));
      }

      let runData = {};

      Object.assign(runData, orgData, operationData, orgTypeJsonData.data, orgJsonData, processData);

      operation.data = runData;
      operation.org = org;

      const doOperation = require('../operations/js/'+ appName + '/' + operation.path.toLowerCase());

      return doOperation(context, Object.assign(options, { operation }));
      
    });

    return context;
  };
};
