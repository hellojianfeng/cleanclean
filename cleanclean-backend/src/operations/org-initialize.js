
const orgInitialize = async function (context, operation) {
    const orgService = context.app.service('orgs');
    const roleService = context.app.service('roles');
    const operationService = context.app.service('operations');

    const user = context.params.user;

    const orgId = user.current_org;

    const org = await orgService.get(orgId);

    const processData = context.data.data;
    const orgData = org.data;
    const operationData = operation.data;

    let runData = {}

    Object.assign(runData, orgData, operationData, processData);

    //add org profiles

    //add org roles
    if(runData.roles && Array.isArray(runData.roles)){
      const roles = runData.roles.map( o => {
        o.org = orgId;
        return o;
      })

      await roleService.create(roles);
    }

    //add org operations
    if(runData.operations && Array.isArray(runData.operations)){
      const operations = runData.operations.map( o => {
        o.org = orgId;
        return o;
      })

      await operationService.create(operations);
    }

    //add departments

    return context;
};

module.exports = orgInitialize;
