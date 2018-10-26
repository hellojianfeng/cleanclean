const assert = require('assert');
const app = require('../../src/app');

describe('\'operation-process\' service', () => {
  it('registered the service', () => {
    const service = app.service('operation-process');

    assert.ok(service, 'Registered the service');
  });
});
