# sfv-cli

[![npm](https://flat.badgen.net/npm/license/sfv-cli)](https://www.npmjs.org/package/sfv-cli)
[![npm](https://flat.badgen.net/npm/v/sfv-cli)](https://www.npmjs.org/package/sfv-cli)
[![CircleCI](https://flat.badgen.net/circleci/github/idleberg/node-sfv-cli)](https://circleci.com/gh/idleberg/node-sfv-cli)
[![David](https://flat.badgen.net/david/dep/idleberg/node-sfv-cli)](https://david-dm.org/idleberg/node-sfv-cli)

CLI tool to verify and create SFV files (see [Simple File Verification](https://www.wikiwand.com/en/Simple_file_verification)). This package also introduces an extended SFV-like file format (`.sfvx`), which supports modern hashing algorithms.

![Screenshot](https://raw.github.com/idleberg/node-sfv-cli/master/screenshot.png)

## Installation

`yarn global add sfv-cli || npm install --global sfv-cli`

## Usage

You can now use the `sfv` command in your Terminal emulator:

```sh
# Create .sfv
sfv vlc.exe -o vlc.sfv

# Verify .sfv
sfv vlc.sfv
```

**Note:** You can also use `node-sfv` to avoid naming conflicts

### Options

Running `sfv --help` lists all available flags

```
  -V, --version                output the version number
  -a, --algorithm [algorithm]  specifies hashing algorithm
  -F, --fail-fast              stops execution after first error (default: false)
  -f, --format                 aligns checksums (default: false)
  -o, --output <file>          specifies output file
  -p, --print                  prints SFV file to stdout (default: false)
  -s, --sort                   sorts output (default: false)
  -w, --winsfv                 enables WinSFV compatibility (default: false)
  -h, --help                   display help for command
```
## Related

- [node-sfv](https://www.npmjs.com/package/simple-file-verification)

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)
