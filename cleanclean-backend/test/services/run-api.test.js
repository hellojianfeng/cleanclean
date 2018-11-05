const assert = require('assert');
const app = require('../../src/app');

describe('\'run-api\' service', () => {
  it('registered the service', () => {
    const service = app.service('run-api');

    assert.ok(service, 'Registered the service');
  });
});
