'use strict';

// Checks for crash regression: https://github.com/nodejs/node/issues/37430
// and https://github.com/nodejs/node/issues/62516

const common = require('../common');
const assert = require('assert');
const {
  createReadStream,
  createWriteStream,
  open,
  openSync,
  promises: {
    open: openPromise,
  },
} = require('fs');

// These should throw, not crash.
const invalid = 4_294_967_296;

// Value within UInt32 range but exceeding Int32 range.
// Regression test for https://github.com/nodejs/node/issues/62516
const invalidInt32 = 2_176_057_344;

assert.throws(() => open(__filename, invalid, common.mustNotCall()), {
  code: 'ERR_OUT_OF_RANGE'
});

assert.throws(() => open(__filename, 0, invalid, common.mustNotCall()), {
  code: 'ERR_OUT_OF_RANGE'
});

assert.throws(() => open(__filename, 0, invalidInt32, common.mustNotCall()), {
  code: 'ERR_OUT_OF_RANGE'
});

assert.throws(() => openSync(__filename, invalid), {
  code: 'ERR_OUT_OF_RANGE'
});

assert.throws(() => openSync(__filename, 0, invalid), {
  code: 'ERR_OUT_OF_RANGE'
});

assert.throws(() => openSync(__filename, 0, invalidInt32), {
  code: 'ERR_OUT_OF_RANGE'
});

assert.rejects(openPromise(__filename, invalid), {
  code: 'ERR_OUT_OF_RANGE'
}).then(common.mustCall());

assert.rejects(openPromise(__filename, 0, invalid), {
  code: 'ERR_OUT_OF_RANGE'
}).then(common.mustCall());

assert.rejects(openPromise(__filename, 0, invalidInt32), {
  code: 'ERR_OUT_OF_RANGE'
}).then(common.mustCall());

// createReadStream and createWriteStream should also validate mode.
// Regression test for https://github.com/nodejs/node/issues/62516
assert.throws(() => createReadStream(__filename, { mode: invalidInt32 }), {
  code: 'ERR_OUT_OF_RANGE'
});

assert.throws(() => createWriteStream(__filename, { mode: invalidInt32 }), {
  code: 'ERR_OUT_OF_RANGE'
});

assert.throws(() => createReadStream(__filename, { mode: invalid }), {
  code: 'ERR_OUT_OF_RANGE'
});

assert.throws(() => createWriteStream(__filename, { mode: invalid }), {
  code: 'ERR_OUT_OF_RANGE'
});
