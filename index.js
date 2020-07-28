#!/usr/bin/env node

const meta = require('package.json');
const resolve = require('path').resolve;
const updateNotifier = require('update-notifier');

/**
 * The TypeScript compiler does not support she-bangs,
 * so we need this stupid workaround 🙄
 */

require(resolve(__dirname, 'bin/cli.js'));
updateNotifier({
  meta
}).notify();
