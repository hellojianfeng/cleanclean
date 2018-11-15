
/**

 */
module.exports = async function (context, options = {}) {

  const pageData = context.data.data;
  const pageName = context.data.page || context.data.name;
  const action = context.data.action || 'start';

  const mongooseClient = context.app.get('mongooseClient');

  const user = context.params.user;

  const orgTypeService = context.app.service('org-types');
  const orgService = context.app.service('orgs');

  const JsonTools = require('../../utils/JsonTools.js');

  if (action === 'start'){
    const findResult = await orgTypeService.find();
    context.result = {
      page: pageName,
      action,
      result: {
        types: findResult.data
      }
    };
  }

  if (action === 'before-create-summary'){
    if(!pageData){
      throw new Error('please provide org data to create!');
    }
    if(!pageData.name){
      throw new Error('org name is required!');
    }
    if(!pageData.type){
      throw new Error('org type is required!');
    }

    context.result = {
      page: pageName,
      action,
      data: {
        create_data: pageData
      }
    };
  }

  if (action === 'create'){
  
    if(!pageData){
      throw new Error('please provide org data to create!');
    }
    if(!pageData.name){
      throw new Error('org name is required!');
    }
    if(!pageData.type){
      throw new Error('org type is required!');
    }

    const createResult = await orgService.create(pageData, context.params);

    context.data.data = {
      create_result: createResult
    };
  }
  
  return context;
};

