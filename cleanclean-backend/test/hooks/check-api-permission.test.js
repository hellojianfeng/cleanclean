const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const checkApiPermission = require('../../src/hooks/check-api-permission');

describe('\'check-api-permission\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      before: checkApiPermission()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
