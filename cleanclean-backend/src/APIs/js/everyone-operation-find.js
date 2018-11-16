
module.exports = async function (context, options = {}) {

  const orgId = context.params.user.current_org;

  const permissionService = context.app.service('permissions');

  const finds = await permissionService.find({
    query: {
      org: orgId,
      path: 'everyone'
    }
  });

  const everyoneOperations = finds.total === 1 ? finds.data[0]['operations'] : [];

  const operations = {};
  const operationService = context.app.service('operations');
  
  await Promise.all(everyoneOperations.map ( async o => {
    operations[o.path] = await operationService.get(o.oid);
  }));

  return context.result = operations;
};

