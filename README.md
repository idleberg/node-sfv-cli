# sfv-cli

[![License](https://img.shields.io/github/license/idleberg/node-sfv-cli?color=blue&style=for-the-badge)](https://github.com/idleberg/node-sfv-cli/blob/main/LICENSE)
[![Version](https://img.shields.io/npm/v/sfv-cli?style=for-the-badge)](https://www.npmjs.org/package/sfv-cli)
[![Build](https://img.shields.io/github/actions/workflow/status/idleberg/node-sfv-cli/default.yml?style=for-the-badge)](https://github.com/idleberg/node-sfv-cli/actions)

CLI tool to verify and create SFV files (see [Simple File Verification](https://www.wikiwand.com/en/Simple_file_verification)).

![Screenshot](https://raw.github.com/idleberg/node-sfv-cli/master/screenshot.png)

## Installation

`$ npm install --global sfv-cli`

For single-time use, you can try `npx`:

`$ npx sfv-cli vlc.sfv`

## Usage

You can now use the `sfv` command in your Terminal emulator:

```sh
# Create .sfv
$ sfv vlc.exe -o vlc.sfv

# Verify .sfv
$ sfv vlc.sfv
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

This work is licensed under [The MIT License](LICENSE)
