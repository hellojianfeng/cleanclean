const fileTool = require("../../../utils/file.js");

module.exports = async function (context, operation) {
    const orgTypeService = context.app.service('org-types');
    const operationService = context.app.service('operations');

    const user = context.params.user;

    const org = operation.org;

    const targetOperation = await operationService.find({
      org: org._id,
      path: operation.data.operation
    }).then( results => {
      if(results.total === 1){
        return results[0];
      } else {
        return null;
      }
    })

    if(!targetOperation){
      context.result = {};
      return context;
    }

    //find operation data
    orgType = orgTypeService.get(org.type.oid);
    const typePath = orgType ? orgType.path : 'company';

    let orgTypeJsonData = {};
    let orgJsonData = {};
    let orgData = {};

    if(org.data.operations && Array.isArray(org.data.operations)){
      org.data.operations.map ( o => {
        if (o.path === targetOperation.path){
          orgData = o.data;
        }
      })
    }

    const orgTypeJsonDataPath = fileTool.getTailFileInDotFolder('src/operations/data/org-types/'+ typePath, targetOperation.path + '.json');
    
    if(orgTypeJsonDataPath){
      orgTypeJsonData = require(orgTypeJsonDataPath.replace(/^src/,'../../..'));
    }

    const orgJsonDataPath = fileTool.getTailFileInDotFolder('src/operations/data/orgs/'+ org.path, targetOperation.path + '.json',"#");
    
    if(orgJsonDataPath){
      orgJsonData = require(orgJsonDataPath.replace(/^src/,'../../..'));
    }

    let runData = {}

    Object.assign(runData, orgData, orgTypeJsonData.data, orgJsonData);

    context.result = runData;

    return context;
};

