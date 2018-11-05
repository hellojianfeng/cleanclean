const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const beforeCreateRunApi = require('../../src/hooks/before-create-run-api');

describe('\'before-create-run-api\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      before: beforeCreateRunApi()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
