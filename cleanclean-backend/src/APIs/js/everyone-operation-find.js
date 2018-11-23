
module.exports = async function (context, options = {}) {

  const parseModels = require('./models-parse');

  const { org, current_org } = await parseModels(context,options);

  const orgId = org && org._id || current_org && current_org._id;

  const permissionService = context.app.service('permissions');

  const finds = await permissionService.find({
    query: {
      'org.oid':orgId,
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

