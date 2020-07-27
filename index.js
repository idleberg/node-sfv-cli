#!/usr/bin/env node

// eslint-disable-next-line
const resolve = require('path').resolve;

/*  The TypeScript compiler does not support she-bangs,
 *  so we need this stupid workaround 🙄
 */
require(resolve(__dirname, 'bin/cli.js'));
