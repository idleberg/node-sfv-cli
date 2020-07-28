#!/usr/bin/env node

const meta = require('package.json');
const updateNotifier = require('update-notifier');
const resolve = require('path').resolve;

/**
 * The TypeScript compiler does not support she-bangs,
 * so we need this stupid workaround 🙄
 */

require(resolve(__dirname, 'bin/cli.js'));
updateNotifier({
  meta
}).notify();
