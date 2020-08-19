// Dependencies
import test from 'ava';
import execa from 'execa';
import hasha from 'hasha';
import { createReadStream } from 'fs';
import { resolve } from 'path';

const CLI_SCRIPT =  resolve(__dirname, '..', 'bin', 'cli.js')

const hashingLength = {
  crc: 8,
  md5: 32,
  sha1: 40,
  sha256: 64,
  sha512: 128
}

// Tests
test('CRC32: Read', async t => {
  const outName = await hasha.async(String(Date.now()))

  const nodeSFV = (await execa('node', [CLI_SCRIPT, 'screenshot.png', '-o', `${outName}.sfv`]));
  const ckSFV = (await execa('cksfv', ['-g', `${outName}.sfv`]));

  const actual = ckSFV.exitCode;
  const expected = 0;

  t.is(actual, expected);
});

test('CRC32: Write', async t => {
  const nodeSFV = (await execa('node', [CLI_SCRIPT, '-p', 'screenshot.png']));
  const ckSFV = (await execa('cksfv', ['-c', 'screenshot.png']));

  const actual = nodeSFV.stdout.trim().slice(-8);
  const expected = ckSFV.stdout.trim().slice(-8);

  t.is(actual, expected);
});

test('MD5: Write', async t => {
  const md5sum = (await execa('md5sum', ['screenshot.png']));
  const nodeSFV = (await execa('node', [CLI_SCRIPT, '-a', 'md5', '-p', 'screenshot.png']));

  const actual = nodeSFV.stdout.trim().slice(-32);
  const expected = md5sum.stdout.trim().slice(0, 32).toUpperCase();

  t.is(actual, expected);
});

test('SHA-1: Write', async t => {
  const sha1sum = (await execa('sha1sum', ['screenshot.png']));
  const nodeSFV = (await execa('node', [CLI_SCRIPT, '-a', 'sha1', '-p', 'screenshot.png']));

  const actual = nodeSFV.stdout.trim().slice(-40);
  const expected = sha1sum.stdout.trim().slice(0, 40).toUpperCase();

  t.is(actual, expected);
});

test('SHA-256: Write', async t => {
  const sha256sum = (await execa('sha256sum', ['screenshot.png']));
  const nodeSFV = (await execa('node', [CLI_SCRIPT, '-a', 'sha256', '-p', 'screenshot.png']));

  const actual = nodeSFV.stdout.trim().slice(-64);
  const expected = sha256sum.stdout.trim().slice(0, 64).toUpperCase();

  t.is(actual, expected);
});

test('SHA-512: Write', async t => {
  const sha512sum = (await execa('sha512sum', ['screenshot.png']));
  const nodeSFV = (await execa('node', [CLI_SCRIPT, '-a', 'sha512', '-p', 'screenshot.png']));

  const actual = nodeSFV.stdout.trim().slice(-128);
  const expected = sha512sum.stdout.trim().slice(0, 128).toUpperCase();

  t.is(actual, expected);
});
