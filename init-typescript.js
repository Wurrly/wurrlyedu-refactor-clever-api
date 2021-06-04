'use strict';
const path = require('path');

require('ts-node').register({
  lazy: false,
  fast: true,
  cacheDirectory: path.join(__dirname, '.tscache'),
  project: path.join(__dirname, 'tsconfig.json'),
});
