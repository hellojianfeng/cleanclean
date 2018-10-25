const assert = require('assert');
const app = require('../../src/app');

describe('\'org-types\' service', () => {
  it('registered the service', () => {
    const service = app.service('org-types');

    assert.ok(service, 'Registered the service');
  });
});
