const fs = require('fs');

return module.exports = {
  getTyedOrgDataThroughNestedPath: async function(context, org = null){

    const mongooseClient = context.app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const orgService = context.app.service('orgs');
    const orgTypeService = context.app.service('org-types');

    const user = context.params.user;

    if(!(user && user.current_org && user.current_org.oid || org)){
      return null;
    }

    org = org || user.current_org && user.current_org.oid;

    if (org instanceof Schema.Types.ObjectId){
      org = await orgService.get(org);
    }

    if(!org){
      return null;
    }

    if(org.type){
      await orgTypeService.get(org.type.oid);
    }
 
        
  }
};