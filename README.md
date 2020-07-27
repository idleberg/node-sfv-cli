# sfv-cli

[![npm](https://flat.badgen.net/npm/license/sfv-cli)](https://www.npmjs.org/package/sfv-cli)
[![npm](https://flat.badgen.net/npm/v/sfv-cli)](https://www.npmjs.org/package/sfv-cli)
[![CircleCI](https://flat.badgen.net/circleci/github/idleberg/node-sfv-cli)](https://circleci.com/gh/idleberg/node-sfv-cli)
[![David](https://flat.badgen.net/david/dep/idleberg/node-sfv-cli)](https://david-dm.org/idleberg/node-sfv-cli)

CLI tool to verify and create SFV files ([Simple File Verification](https://www.wikiwand.com/en/Simple_file_verification))

## Installation

`yarn global add sfv-cli || npm install --global sfv-cli`

## Usage

You can now use the `sfv` command in your Terminal emulator:

```sh
# Create .sfv
sfv vlc.exe -o vlc.sfv

# Verify against .sfv
sfv vlc.sfv
```

### Options

Running `sfv --help` list available flags

```
-V, --version        output the version number
-f, --fail-fast      aborts verifying after first mismatch (default: false)
-o, --output <file>  specifies output file
-p, --print          prints SFV file to stdout (default: false)
-s, --sort           sorts output (default: false)
-w, --winsfv         writes WinSFV compatible comment (default: false)
-h, --help           display help for command
```

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)
