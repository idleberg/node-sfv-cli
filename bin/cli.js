'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = require('fs');
var buffer = _interopDefault(require('buffer'));
var ora = _interopDefault(require('ora'));
var terminalLink = _interopDefault(require('terminal-link'));
var chalk = _interopDefault(require('chalk'));
var getStdin = _interopDefault(require('get-stdin'));
var program = _interopDefault(require('commander'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var name = "sfv-cli";
var version = "0.1.0";
var description = "CLI tool to verify and create SFV files";
var license = "MIT";
var scripts = {
	build: "rollup --config",
	dev: "npm run start",
	lint: "eslint ./src",
	start: "rollup --watch --config",
	test: "npm run lint"
};
var main = "index.js";
var bin = {
	sfv: "./index.js",
	"node-sfv": "./index.js"
};
var homepage = "https://www.npmjs.com/package/sfv-cli";
var repository = {
	type: "git",
	url: "https://github.com/idleberg/node-sfv-cli.git"
};
var keywords = [
	"simple file verification",
	"sfv",
	"crc",
	"crc32"
];
var dependencies = {
	"buffer-crc32": "^0.2.13",
	chalk: "^4.1.0",
	commander: "^6.0.0",
	"get-stdin": "^8.0.0",
	ora: "^4.0.5",
	"terminal-link": "^2.1.1"
};
var devDependencies = {
	"@rollup/plugin-commonjs": "^14.0.0",
	"@rollup/plugin-json": "^4.1.0",
	"@rollup/plugin-typescript": "^5.0.2",
	"@types/node": "^14.0.26",
	"@typescript-eslint/eslint-plugin": "^3.7.0",
	"@typescript-eslint/parser": "^3.7.0",
	ava: "^3.10.1",
	eslint: "^7.5.0",
	esm: "^3.2.25",
	glob: "^7.1.6",
	husky: "^4.2.5",
	rollup: "^2.23.0",
	typescript: "^3.9.7"
};
var husky = {
	hooks: {
		"pre-commit": "npm run lint"
	}
};
var ava = {
	require: [
		"esm"
	]
};
var meta = {
	name: name,
	version: version,
	description: description,
	license: license,
	scripts: scripts,
	main: main,
	bin: bin,
	homepage: homepage,
	repository: repository,
	keywords: keywords,
	dependencies: dependencies,
	devDependencies: devDependencies,
	husky: husky,
	ava: ava
};

var Buffer$1 = buffer.Buffer;

var CRC_TABLE = [
  0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419,
  0x706af48f, 0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4,
  0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07,
  0x90bf1d91, 0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de,
  0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7, 0x136c9856,
  0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9,
  0xfa0f3d63, 0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4,
  0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b,
  0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3,
  0x45df5c75, 0xdcd60dcf, 0xabd13d59, 0x26d930ac, 0x51de003a,
  0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599,
  0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924,
  0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190,
  0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f,
  0x9fbfe4a5, 0xe8b8d433, 0x7807c9a2, 0x0f00f934, 0x9609a88e,
  0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01,
  0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed,
  0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950,
  0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3,
  0xfbd44c65, 0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2,
  0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a,
  0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5,
  0xaa0a4c5f, 0xdd0d7cc9, 0x5005713c, 0x270241aa, 0xbe0b1010,
  0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
  0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17,
  0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6,
  0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615,
  0x73dc1683, 0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8,
  0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1, 0xf00f9344,
  0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb,
  0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a,
  0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5,
  0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1,
  0xa6bc5767, 0x3fb506dd, 0x48b2364b, 0xd80d2bda, 0xaf0a1b4c,
  0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef,
  0x4669be79, 0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236,
  0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe,
  0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31,
  0x2cd99e8b, 0x5bdeae1d, 0x9b64c2b0, 0xec63f226, 0x756aa39c,
  0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713,
  0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b,
  0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21, 0x86d3d2d4, 0xf1d4e242,
  0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1,
  0x18b74777, 0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c,
  0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45, 0xa00ae278,
  0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7,
  0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc, 0x40df0b66,
  0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
  0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605,
  0xcdd70693, 0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8,
  0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b,
  0x2d02ef8d
];

if (typeof Int32Array !== 'undefined') {
  CRC_TABLE = new Int32Array(CRC_TABLE);
}

function ensureBuffer(input) {
  if (Buffer$1.isBuffer(input)) {
    return input;
  }

  var hasNewBufferAPI =
      typeof Buffer$1.alloc === "function" &&
      typeof Buffer$1.from === "function";

  if (typeof input === "number") {
    return hasNewBufferAPI ? Buffer$1.alloc(input) : new Buffer$1(input);
  }
  else if (typeof input === "string") {
    return hasNewBufferAPI ? Buffer$1.from(input) : new Buffer$1(input);
  }
  else {
    throw new Error("input must be buffer, number, or string, received " +
                    typeof input);
  }
}

function bufferizeInt(num) {
  var tmp = ensureBuffer(4);
  tmp.writeInt32BE(num, 0);
  return tmp;
}

function _crc32(buf, previous) {
  buf = ensureBuffer(buf);
  if (Buffer$1.isBuffer(previous)) {
    previous = previous.readUInt32BE(0);
  }
  var crc = ~~previous ^ -1;
  for (var n = 0; n < buf.length; n++) {
    crc = CRC_TABLE[(crc ^ buf[n]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ -1);
}

function crc32() {
  return bufferizeInt(_crc32.apply(null, arguments));
}
crc32.signed = function () {
  return _crc32.apply(null, arguments);
};
crc32.unsigned = function () {
  return _crc32.apply(null, arguments) >>> 0;
};

var bufferCrc32 = crc32;

function bufferToString(inputBuffer) {
    var outputString = [];
    inputBuffer.forEach(function (item) {
        return outputString.push(item
            .toString(16)
            .toUpperCase()
            .padStart(2, '0'));
    });
    return outputString.join('');
}
function checksumFromBuffer(inputStream) {
    return __awaiter(this, void 0, void 0, function () {
        var checksum;
        return __generator(this, function (_a) {
            checksum = bufferCrc32(inputStream);
            if (!isValidChecksum(checksum)) {
                throw Error('Not a valid checksum');
            }
            return [2 /*return*/, bufferToString(checksum)];
        });
    });
}
function checksumFromFile(inputFile) {
    return __awaiter(this, void 0, void 0, function () {
        var fileBuffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.promises.readFile(inputFile)];
                case 1:
                    fileBuffer = _a.sent();
                    return [2 /*return*/, checksumFromBuffer(fileBuffer)];
            }
        });
    });
}
function compareSFV(files, failFast) {
    if (failFast === void 0) { failFast = false; }
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                        var sfvFile;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, readSFV(file)];
                                case 1:
                                    sfvFile = _a.sent();
                                    console.log('Verifying files:');
                                    return [4 /*yield*/, Promise.all(sfvFile.map(function (_a) {
                                            var file = _a.file, crc32 = _a.crc32;
                                            return __awaiter(_this, void 0, void 0, function () {
                                                var spinner, actualCRC;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            spinner = ora(file).start();
                                                            return [4 /*yield*/, checksumFromFile(file)];
                                                        case 1:
                                                            actualCRC = _b.sent();
                                                            if (crc32 === actualCRC) {
                                                                spinner.succeed(file + " " + chalk.blue(crc32));
                                                            }
                                                            else {
                                                                spinner.fail(file + " " + chalk.red(crc32) + " (actual: " + chalk.blue(actualCRC) + ")");
                                                                if (failFast)
                                                                    throw 'Failing fast';
                                                            }
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            });
                                        }))];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createSFV(files, printOutput) {
    return __awaiter(this, void 0, void 0, function () {
        var checksum;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!printOutput) {
                        checksum = (files.length === 1)
                            ? 'checksum'
                            : 'checksums';
                        console.log("Calculating " + checksum + ":");
                    }
                    return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                            var spinner, checksum, e_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!printOutput) {
                                            spinner = ora("" + file).start();
                                        }
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, checksumFromFile(file)];
                                    case 2:
                                        checksum = _a.sent();
                                        if (!printOutput)
                                            spinner.succeed(file + " " + chalk.blue(checksum));
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_1 = _a.sent();
                                        if (!printOutput)
                                            spinner.fail(file + " " + chalk.dim(e_1));
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/, file + " " + checksum];
                                }
                            });
                        }); }))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getDate() {
    var date = new Date();
    return {
        year: date.getFullYear().toString(),
        month: date.getMonth().toString().padStart(2, '0'),
        day: date.getMonth().toString().padStart(2, '0'),
        hours: date.getHours().toString().padStart(2, '0'),
        minutes: date.getMinutes().toString().padStart(2, '0'),
        seconds: date.getSeconds().toString().padStart(2, '0')
    };
}
function isValidChecksum(checksum) {
    return Buffer.isBuffer(checksum) && checksum.length === 4;
}
function parseSFV(input) {
    var lines = Array.isArray(input)
        ? stripComments(input)
        : stripComments(input.split('\n'));
    return lines.map(function (line) {
        var _a = line
            .trim()
            .split(/^(.*)\s+(\w{8})$/g)
            .filter(function (item) { return item; }), file = _a[0], crc32 = _a[1];
        return file && crc32
            ? {
                file: file,
                crc32: crc32
            }
            : null;
    }).filter(function (item) { return item; });
}
function printTitle() {
    var title = meta.name + " v" + meta.version;
    var linkedTitle = terminalLink(title, meta.homepage, {
        fallback: function () {
            return title + " | " + meta.homepage;
        }
    });
    console.log(linkedTitle + "\n");
}
function readSFV(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var fileContents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.promises.readFile(filePath)];
                case 1:
                    fileContents = (_a.sent()).toString();
                    return [2 /*return*/, parseSFV(fileContents.toString())];
            }
        });
    });
}
function setComment(useWinSFV) {
    var _a = getDate(), year = _a.year, month = _a.month, day = _a.day, hours = _a.hours, minutes = _a.minutes, seconds = _a.seconds;
    return useWinSFV
        ? "; Generated by WIN-SFV32 v1.1a on " + year + "-" + month + "-" + day + " at " + hours + ":" + minutes + "." + seconds + "\n;"
        : "; " + meta.name + " v" + meta.version + " | " + meta.homepage + "\n;";
}
function stripComments(lines) {
    return lines.filter(function (line) {
        return !line
            .trim()
            .startsWith(';');
    });
}
function writeSFV(fileName, fileContents) {
    return __awaiter(this, void 0, void 0, function () {
        var outputFile, spinner, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    outputFile = fileName.endsWith('.sfv')
                        ? fileName
                        : fileName + ".sfv";
                    console.log('\nWriting output:');
                    spinner = ora(outputFile).start();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs.promises.writeFile(outputFile, fileContents)];
                case 2:
                    _a.sent();
                    spinner.succeed(outputFile);
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    spinner.fail(outputFile + " " + chalk.dim(e_2));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}

program
    .version(meta.version)
    .description(meta.description)
    .arguments('[options] <file ...>')
    .usage('[options] <file ...>')
    .option('-f, --fail-fast', 'aborts verifying after first mismatch', false)
    .option('-o, --output <file>', 'specifies output file')
    .option('-p, --print', 'prints SFV file to stdout', false)
    .option('-s, --sort', 'sorts output', false)
    .option('-w, --winsfv', 'writes WinSFV compatible comment', false)
    .parse(process.argv);
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var completedIn, stdIn, files, sfvFiles, e_1, sfvFile, outputString, spinner, checksum;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                completedIn = '\n✨ Completed in';
                if (!program.print)
                    console.time(completedIn);
                return [4 /*yield*/, getStdin.buffer()];
            case 1:
                stdIn = _a.sent();
                files = program.args;
                if (!files.length && !stdIn.length) {
                    return [2 /*return*/, program.help()];
                }
                if (!(files.length > 0)) return [3 /*break*/, 12];
                if (!program.print)
                    printTitle();
                sfvFiles = files.filter(function (file) { return file.endsWith('.sfv'); });
                if (!(files.length && files.length === sfvFiles.length)) return [3 /*break*/, 6];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, compareSFV(files, program.failFast)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.error('\n🔥 Aborting due to mismatch');
                process.exit();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, console.timeEnd(completedIn)];
            case 6: return [4 /*yield*/, createSFV(files, program.print)];
            case 7:
                sfvFile = _a.sent();
                sfvFile.unshift(setComment(program.winsfv));
                sfvFile = sfvFile.filter(function (line) { return line; });
                outputString = program.sort
                    ? sfvFile.sort().join('\n')
                    : sfvFile.join('\n');
                if (!!program.print) return [3 /*break*/, 10];
                if (!program.output) return [3 /*break*/, 9];
                return [4 /*yield*/, writeSFV(program.output, outputString)];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                console.timeEnd(completedIn);
                return [3 /*break*/, 11];
            case 10:
                console.log(outputString);
                _a.label = 11;
            case 11: return [3 /*break*/, 14];
            case 12:
                if (!(stdIn.length > 0)) return [3 /*break*/, 14];
                printTitle();
                spinner = ora('<stdin>').start();
                return [4 /*yield*/, checksumFromBuffer(stdIn)];
            case 13:
                checksum = _a.sent();
                spinner.succeed("<stdin> " + chalk.blue(checksum));
                return [2 /*return*/, console.timeEnd(completedIn)];
            case 14: return [2 /*return*/];
        }
    });
}); })();
