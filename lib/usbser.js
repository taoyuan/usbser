'use strict';

function unsupported() {
  throw new Error('Unsupported');
}

if (process.platform === 'win32') {
  exports.list = unsupported;
} else if (process.platform === 'darwin') {
  exports.list = unsupported;
} else {
  exports.list = require('./linux').list;
}
