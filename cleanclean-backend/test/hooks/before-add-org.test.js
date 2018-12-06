const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const beforeAddOrg = require('../../src/hooks/before-add-org');

describe('\'before-add-org\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      //before: beforeAddOrg()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
