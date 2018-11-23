const fs = require('fs');

return module.exports = {
    getTyedOrgDataThroughNestedPath: function(context, org = null){

        const mongooseClient = context.app.get('mongooseClient');
        const { Schema } = mongooseClient;

        const user = context.params.user;

        if(!(user && user.current_org && user.current_org.oid || org)){
            return null;
        }

        let org = org || user.current_org && user.current_org.oid;

        if (org instanceof Schema.Types.ObjectId){
            org = await orgService.get(org);
        }

        if(!org){
            return null;
        }

        if(org.type){
            const orgType = await orgTypeService.get(org.type.oid);
        }
 
        
    }
  };