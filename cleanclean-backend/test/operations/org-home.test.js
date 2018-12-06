const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const orgHome = require('../../src/operations/js/default/org-home');
const app = require('../../src/app');
let user, org;
const runService = app.service('run-operation');

describe('\'org-home\' operation', () => {

  beforeEach( async () => {
    //add user
    const userService = app.service('users');
    let finds = await userService.find({query:{email: 'user1@example.com'}});
    if (finds.total !== 1){
        await userService.create( { email: "user1@example.com", password: "secret" });
    }
    finds = await userService.find({query:{email: 'user1@example.com'}});
    user = finds.data[0];

    //create org
    const orgService = app.service('orgs');
    finds = await orgService.find({query:{path:"company1"}});
    if (finds.total !== 1){
      await orgService.create({ name: "company1", type: "company.clean"}, { user });
    }
    finds = await orgService.find({query:{path:"company1"}});
    org = finds.data[0];

    //initialize org
    await runService.create({operation: 'org-initialize',action: 'initialize'}, { user });
    
  });

  it('runs org-home operation', async () => {
    const service = app.service('run-operation');
    const data = {
        operation: 'org-home',
        data: {
          org: 'company1'
        }
    };

    const result = await service.create(data,{user});

    assert.ok(result.result.org._id);
    
  });
});
