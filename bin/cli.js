'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = require('fs');
var path = require('path');
var stream = _interopDefault(require('stream'));
var hasha = _interopDefault(require('hasha'));
var ora = _interopDefault(require('ora'));
var terminalLink = _interopDefault(require('terminal-link'));
var chalk = _interopDefault(require('chalk'));
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
var version = "0.4.1";
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
	"sfvx",
	"crc",
	"crc32",
	"md5",
	"sha1",
	"sha256",
	"sha512"
];
var dependencies = {
	chalk: "^4.1.0",
	commander: "^6.0.0",
	"cyclic-32": "^1.1.0",
	hasha: "^5.2.0",
	ora: "^4.0.5",
	"terminal-link": "^2.1.1",
	"update-notifier": "^4.1.0"
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

/**
 * Calculate the CRC32 checksum of a given buffer
 * @param {Buffer} buffer
 * @param {Number} [seed=0]
 * @param {Int32Array} [table=crc32.TABLE.DEFAULT]
 * @returns {Number} checksum
 */
function crc32( buffer, seed, table ) {

  var crc = seed ^ -1;
  var length = buffer.length - 15;
  var TABLE = table || crc32.TABLE.DEFAULT;
  var i = 0;

  while( i < length ) {
    crc = ( crc >>> 8 ) ^ TABLE[ 0xFF & ( crc ^ buffer[ i++ ] ) ];
    crc = ( crc >>> 8 ) ^ TABLE[ 0xFF & ( crc ^ buffer[ i++ ] ) ];
    crc = ( crc >>> 8 ) ^ TABLE[ 0xFF & ( crc ^ buffer[ i++ ] ) ];
    crc = ( crc >>> 8 ) ^ TABLE[ 0xFF & ( crc ^ buffer[ i++ ] ) ];
    crc = ( crc >>> 8 ) ^ TABLE[ 0xFF & ( crc ^ buffer[ i++ ] ) ];
    crc = ( crc >>> 8 ) ^ TABLE[ 0xFF & ( crc ^ buffer[ i++ ] ) ];
    crc = ( crc >>> 8 ) ^ TABLE[ 0xFF & ( crc ^ buffer[ i++ ] ) ];
    crc = ( crc >>> 8 ) ^ TABLE[ 0xFF & ( crc ^ buffer[ i++ ] ) ];
    crc = ( crc >>> 8 ) ^ TABLE[ 0xFF & ( crc ^ buffer[ i++ ] ) ];
    crc = ( crc >>> 8 ) ^ TABLE[ 0xFF & ( crc ^ buffer[ i++ ] ) ];
    crc = ( crc >>> 8 ) ^ TABLE[ 0xFF & ( crc ^ buffer[ i++ ] ) ];
    crc = ( crc >>> 8 ) ^ TABLE[ 0xFF & ( crc ^ buffer[ i++ ] ) ];
    crc = ( crc >>> 8 ) ^ TABLE[ 0xFF & ( crc ^ buffer[ i++ ] ) ];
    crc = ( crc >>> 8 ) ^ TABLE[ 0xFF & ( crc ^ buffer[ i++ ] ) ];
    crc = ( crc >>> 8 ) ^ TABLE[ 0xFF & ( crc ^ buffer[ i++ ] ) ];
    crc = ( crc >>> 8 ) ^ TABLE[ 0xFF & ( crc ^ buffer[ i++ ] ) ];
  }

  length = length + 15;

  while( i < length )
    crc = ( crc >>> 8 ) ^ TABLE[ ( crc ^ buffer[ i++ ] ) & 0xFF ];

  return crc ^ -1

}

var crc32_1 = crc32;

/**
 * CRC32 Lookup tables
 * @enum {Int32Array}
 */
crc32.TABLE = {

  /**
   * Default CRC-32 Lookup Table
   * @type {Int32Array}
   */
  DEFAULT: new Int32Array([
    0x00000000,  0x77073096,  0xee0e612c,  0x990951ba,  0x076dc419,  0x706af48f,  0xe963a535,  0x9e6495a3,
    0x0edb8832,  0x79dcb8a4,  0xe0d5e91e,  0x97d2d988,  0x09b64c2b,  0x7eb17cbd,  0xe7b82d07,  0x90bf1d91,
    0x1db71064,  0x6ab020f2,  0xf3b97148,  0x84be41de,  0x1adad47d,  0x6ddde4eb,  0xf4d4b551,  0x83d385c7,
    0x136c9856,  0x646ba8c0,  0xfd62f97a,  0x8a65c9ec,  0x14015c4f,  0x63066cd9,  0xfa0f3d63,  0x8d080df5,
    0x3b6e20c8,  0x4c69105e,  0xd56041e4,  0xa2677172,  0x3c03e4d1,  0x4b04d447,  0xd20d85fd,  0xa50ab56b,
    0x35b5a8fa,  0x42b2986c,  0xdbbbc9d6,  0xacbcf940,  0x32d86ce3,  0x45df5c75,  0xdcd60dcf,  0xabd13d59,
    0x26d930ac,  0x51de003a,  0xc8d75180,  0xbfd06116,  0x21b4f4b5,  0x56b3c423,  0xcfba9599,  0xb8bda50f,
    0x2802b89e,  0x5f058808,  0xc60cd9b2,  0xb10be924,  0x2f6f7c87,  0x58684c11,  0xc1611dab,  0xb6662d3d,
    0x76dc4190,  0x01db7106,  0x98d220bc,  0xefd5102a,  0x71b18589,  0x06b6b51f,  0x9fbfe4a5,  0xe8b8d433,
    0x7807c9a2,  0x0f00f934,  0x9609a88e,  0xe10e9818,  0x7f6a0dbb,  0x086d3d2d,  0x91646c97,  0xe6635c01,
    0x6b6b51f4,  0x1c6c6162,  0x856530d8,  0xf262004e,  0x6c0695ed,  0x1b01a57b,  0x8208f4c1,  0xf50fc457,
    0x65b0d9c6,  0x12b7e950,  0x8bbeb8ea,  0xfcb9887c,  0x62dd1ddf,  0x15da2d49,  0x8cd37cf3,  0xfbd44c65,
    0x4db26158,  0x3ab551ce,  0xa3bc0074,  0xd4bb30e2,  0x4adfa541,  0x3dd895d7,  0xa4d1c46d,  0xd3d6f4fb,
    0x4369e96a,  0x346ed9fc,  0xad678846,  0xda60b8d0,  0x44042d73,  0x33031de5,  0xaa0a4c5f,  0xdd0d7cc9,
    0x5005713c,  0x270241aa,  0xbe0b1010,  0xc90c2086,  0x5768b525,  0x206f85b3,  0xb966d409,  0xce61e49f,
    0x5edef90e,  0x29d9c998,  0xb0d09822,  0xc7d7a8b4,  0x59b33d17,  0x2eb40d81,  0xb7bd5c3b,  0xc0ba6cad,
    0xedb88320,  0x9abfb3b6,  0x03b6e20c,  0x74b1d29a,  0xead54739,  0x9dd277af,  0x04db2615,  0x73dc1683,
    0xe3630b12,  0x94643b84,  0x0d6d6a3e,  0x7a6a5aa8,  0xe40ecf0b,  0x9309ff9d,  0x0a00ae27,  0x7d079eb1,
    0xf00f9344,  0x8708a3d2,  0x1e01f268,  0x6906c2fe,  0xf762575d,  0x806567cb,  0x196c3671,  0x6e6b06e7,
    0xfed41b76,  0x89d32be0,  0x10da7a5a,  0x67dd4acc,  0xf9b9df6f,  0x8ebeeff9,  0x17b7be43,  0x60b08ed5,
    0xd6d6a3e8,  0xa1d1937e,  0x38d8c2c4,  0x4fdff252,  0xd1bb67f1,  0xa6bc5767,  0x3fb506dd,  0x48b2364b,
    0xd80d2bda,  0xaf0a1b4c,  0x36034af6,  0x41047a60,  0xdf60efc3,  0xa867df55,  0x316e8eef,  0x4669be79,
    0xcb61b38c,  0xbc66831a,  0x256fd2a0,  0x5268e236,  0xcc0c7795,  0xbb0b4703,  0x220216b9,  0x5505262f,
    0xc5ba3bbe,  0xb2bd0b28,  0x2bb45a92,  0x5cb36a04,  0xc2d7ffa7,  0xb5d0cf31,  0x2cd99e8b,  0x5bdeae1d,
    0x9b64c2b0,  0xec63f226,  0x756aa39c,  0x026d930a,  0x9c0906a9,  0xeb0e363f,  0x72076785,  0x05005713,
    0x95bf4a82,  0xe2b87a14,  0x7bb12bae,  0x0cb61b38,  0x92d28e9b,  0xe5d5be0d,  0x7cdcefb7,  0x0bdbdf21,
    0x86d3d2d4,  0xf1d4e242,  0x68ddb3f8,  0x1fda836e,  0x81be16cd,  0xf6b9265b,  0x6fb077e1,  0x18b74777,
    0x88085ae6,  0xff0f6a70,  0x66063bca,  0x11010b5c,  0x8f659eff,  0xf862ae69,  0x616bffd3,  0x166ccf45,
    0xa00ae278,  0xd70dd2ee,  0x4e048354,  0x3903b3c2,  0xa7672661,  0xd06016f7,  0x4969474d,  0x3e6e77db,
    0xaed16a4a,  0xd9d65adc,  0x40df0b66,  0x37d83bf0,  0xa9bcae53,  0xdebb9ec5,  0x47b2cf7f,  0x30b5ffe9,
    0xbdbdf21c,  0xcabac28a,  0x53b39330,  0x24b4a3a6,  0xbad03605,  0xcdd70693,  0x54de5729,  0x23d967bf,
    0xb3667a2e,  0xc4614ab8,  0x5d681b02,  0x2a6f2b94,  0xb40bbe37,  0xc30c8ea1,  0x5a05df1b,  0x2d02ef8d,
  ]),

  /**
   * CRC-32C (Castagnoli) Lookup Table
   * @type {Int32Array}
   */
  CASTAGNOLI: new Int32Array([
    0x00000000,  0xf26b8303,  0xe13b70f7,  0x1350f3f4,  0xc79a971f,  0x35f1141c,  0x26a1e7e8,  0xd4ca64eb,
    0x8ad958cf,  0x78b2dbcc,  0x6be22838,  0x9989ab3b,  0x4d43cfd0,  0xbf284cd3,  0xac78bf27,  0x5e133c24,
    0x105ec76f,  0xe235446c,  0xf165b798,  0x030e349b,  0xd7c45070,  0x25afd373,  0x36ff2087,  0xc494a384,
    0x9a879fa0,  0x68ec1ca3,  0x7bbcef57,  0x89d76c54,  0x5d1d08bf,  0xaf768bbc,  0xbc267848,  0x4e4dfb4b,
    0x20bd8ede,  0xd2d60ddd,  0xc186fe29,  0x33ed7d2a,  0xe72719c1,  0x154c9ac2,  0x061c6936,  0xf477ea35,
    0xaa64d611,  0x580f5512,  0x4b5fa6e6,  0xb93425e5,  0x6dfe410e,  0x9f95c20d,  0x8cc531f9,  0x7eaeb2fa,
    0x30e349b1,  0xc288cab2,  0xd1d83946,  0x23b3ba45,  0xf779deae,  0x05125dad,  0x1642ae59,  0xe4292d5a,
    0xba3a117e,  0x4851927d,  0x5b016189,  0xa96ae28a,  0x7da08661,  0x8fcb0562,  0x9c9bf696,  0x6ef07595,
    0x417b1dbc,  0xb3109ebf,  0xa0406d4b,  0x522bee48,  0x86e18aa3,  0x748a09a0,  0x67dafa54,  0x95b17957,
    0xcba24573,  0x39c9c670,  0x2a993584,  0xd8f2b687,  0x0c38d26c,  0xfe53516f,  0xed03a29b,  0x1f682198,
    0x5125dad3,  0xa34e59d0,  0xb01eaa24,  0x42752927,  0x96bf4dcc,  0x64d4cecf,  0x77843d3b,  0x85efbe38,
    0xdbfc821c,  0x2997011f,  0x3ac7f2eb,  0xc8ac71e8,  0x1c661503,  0xee0d9600,  0xfd5d65f4,  0x0f36e6f7,
    0x61c69362,  0x93ad1061,  0x80fde395,  0x72966096,  0xa65c047d,  0x5437877e,  0x4767748a,  0xb50cf789,
    0xeb1fcbad,  0x197448ae,  0x0a24bb5a,  0xf84f3859,  0x2c855cb2,  0xdeeedfb1,  0xcdbe2c45,  0x3fd5af46,
    0x7198540d,  0x83f3d70e,  0x90a324fa,  0x62c8a7f9,  0xb602c312,  0x44694011,  0x5739b3e5,  0xa55230e6,
    0xfb410cc2,  0x092a8fc1,  0x1a7a7c35,  0xe811ff36,  0x3cdb9bdd,  0xceb018de,  0xdde0eb2a,  0x2f8b6829,
    0x82f63b78,  0x709db87b,  0x63cd4b8f,  0x91a6c88c,  0x456cac67,  0xb7072f64,  0xa457dc90,  0x563c5f93,
    0x082f63b7,  0xfa44e0b4,  0xe9141340,  0x1b7f9043,  0xcfb5f4a8,  0x3dde77ab,  0x2e8e845f,  0xdce5075c,
    0x92a8fc17,  0x60c37f14,  0x73938ce0,  0x81f80fe3,  0x55326b08,  0xa759e80b,  0xb4091bff,  0x466298fc,
    0x1871a4d8,  0xea1a27db,  0xf94ad42f,  0x0b21572c,  0xdfeb33c7,  0x2d80b0c4,  0x3ed04330,  0xccbbc033,
    0xa24bb5a6,  0x502036a5,  0x4370c551,  0xb11b4652,  0x65d122b9,  0x97baa1ba,  0x84ea524e,  0x7681d14d,
    0x2892ed69,  0xdaf96e6a,  0xc9a99d9e,  0x3bc21e9d,  0xef087a76,  0x1d63f975,  0x0e330a81,  0xfc588982,
    0xb21572c9,  0x407ef1ca,  0x532e023e,  0xa145813d,  0x758fe5d6,  0x87e466d5,  0x94b49521,  0x66df1622,
    0x38cc2a06,  0xcaa7a905,  0xd9f75af1,  0x2b9cd9f2,  0xff56bd19,  0x0d3d3e1a,  0x1e6dcdee,  0xec064eed,
    0xc38d26c4,  0x31e6a5c7,  0x22b65633,  0xd0ddd530,  0x0417b1db,  0xf67c32d8,  0xe52cc12c,  0x1747422f,
    0x49547e0b,  0xbb3ffd08,  0xa86f0efc,  0x5a048dff,  0x8ecee914,  0x7ca56a17,  0x6ff599e3,  0x9d9e1ae0,
    0xd3d3e1ab,  0x21b862a8,  0x32e8915c,  0xc083125f,  0x144976b4,  0xe622f5b7,  0xf5720643,  0x07198540,
    0x590ab964,  0xab613a67,  0xb831c993,  0x4a5a4a90,  0x9e902e7b,  0x6cfbad78,  0x7fab5e8c,  0x8dc0dd8f,
    0xe330a81a,  0x115b2b19,  0x020bd8ed,  0xf0605bee,  0x24aa3f05,  0xd6c1bc06,  0xc5914ff2,  0x37faccf1,
    0x69e9f0d5,  0x9b8273d6,  0x88d28022,  0x7ab90321,  0xae7367ca,  0x5c18e4c9,  0x4f48173d,  0xbd23943e,
    0xf36e6f75,  0x0105ec76,  0x12551f82,  0xe03e9c81,  0x34f4f86a,  0xc69f7b69,  0xd5cf889d,  0x27a40b9e,
    0x79b737ba,  0x8bdcb4b9,  0x988c474d,  0x6ae7c44e,  0xbe2da0a5,  0x4c4623a6,  0x5f16d052,  0xad7d5351,
  ]),

};

/**
 * CRC32 checksum stream
 * @constructor
 * @extends {stream.Transform}
 * @param {Object} [options]
 * @param {Number} [options.seed=0]
 * @param {Int32Array} [options.table=crc32.TABLE.DEFAULT]
 * @returns {CRC32Stream}
 */
crc32.Hash = class CRC32Stream extends stream.Transform {

  constructor( options ) {
    super( options );
    this.bytesRead = 0;
    this.bytesWritten = 0;
    this.crc = options && options.seed != null ?
      options.seed : 0;
    this.crcTable = options && ( options.table || crc32.TABLE.DEFAULT );
  }

  update( data, encoding ) {
    this.write( data, encoding );
    return this
  }

  digest( encoding ) {
    var buffer = Buffer.alloc( 4, 0 );
    buffer.writeInt32BE( this.crc, 0 );
    return encoding == null ?
      buffer : buffer.toString( encoding )
  }

  _transform( chunk, _, next ) {
    this.bytesRead += chunk.length;
    this.crc = crc32( chunk, this.crc, this.crcTable );
    next();
  }

  _flush( done ) {
    this.push( this.digest() );
    this.bytesWritten += 4;
    done();
  }

};

/**
 * Create a CRC32 checksum stream
 * @returns {crc32.Hash}
 */
crc32.createHash = function createHash() {
  return new crc32.Hash()
};

function checksumFromStream(stream, algorithm) {
    return __awaiter(this, void 0, void 0, function () {
        var hashingFunction;
        return __generator(this, function (_a) {
            hashingFunction = algorithm === 'crc32'
                ? crc32_1.createHash()
                : hasha.stream({ algorithm: algorithm });
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    stream
                        .pipe(hashingFunction)
                        .on('error', function (err) { return reject(err); })
                        .on('data', function (buffer) { return resolve(buffer.toString('hex').toUpperCase()); });
                })];
        });
    });
}
function checksumFromFile(inputFile, algorithm) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.promises.access(inputFile)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, checksumFromStream(fs.createReadStream(inputFile), algorithm)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function compareSFV(sfvFiles, failFast) {
    if (failFast === void 0) { failFast = false; }
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\nVerifying files:');
                    return [4 /*yield*/, Promise.all(sfvFiles.map(function (sfvFile) { return __awaiter(_this, void 0, void 0, function () {
                            var sfvContents;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, readSFV(sfvFile)];
                                    case 1:
                                        sfvContents = _a.sent();
                                        return [4 /*yield*/, Promise.all(sfvContents.map(function (_a) {
                                                var file = _a.file, checksum = _a.checksum;
                                                return __awaiter(_this, void 0, void 0, function () {
                                                    var spinner, actualChecksum, algorithm, e_1;
                                                    return __generator(this, function (_b) {
                                                        switch (_b.label) {
                                                            case 0:
                                                                spinner = ora(file).start();
                                                                algorithm = sfvFile.endsWith('.sfvx')
                                                                    ? detectHash(checksum)
                                                                    : 'crc32';
                                                                _b.label = 1;
                                                            case 1:
                                                                _b.trys.push([1, 3, , 4]);
                                                                return [4 /*yield*/, checksumFromFile(file, algorithm)];
                                                            case 2:
                                                                actualChecksum = _b.sent();
                                                                return [3 /*break*/, 4];
                                                            case 3:
                                                                e_1 = _b.sent();
                                                                spinner.fail(file + " " + chalk.red(checksum) + " " + chalk.dim(e_1));
                                                                if (failFast) {
                                                                    throw 'Failing fast';
                                                                }
                                                                else {
                                                                    return [2 /*return*/];
                                                                }
                                                            case 4:
                                                                if (checksum === actualChecksum) {
                                                                    spinner.succeed(file + " " + chalk.blue(checksum));
                                                                }
                                                                else {
                                                                    spinner.fail(file + " " + chalk.red(checksum) + " (actual: " + chalk.blue(actualChecksum) + ")");
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
function detectHash(algorithm) {
    switch (algorithm.length) {
        case 8:
            return 'crc32';
        case 32:
            return 'md5';
        case 40:
            return 'sha1';
        case 64:
            return 'sha256';
        case 128:
            return 'sha512';
        default:
            throw Error('Unsupported hashing algorithm');
    }
}
function calculateChecksum(files, options) {
    return __awaiter(this, void 0, void 0, function () {
        var checksum;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!options.print) {
                        checksum = (files.length === 1)
                            ? 'checksum'
                            : 'checksums';
                        console.log("\nCalculating " + checksum + ":");
                    }
                    return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                            var spinner, checksum, e_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!options.print) {
                                            spinner = ora("" + file).start();
                                        }
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, checksumFromFile(file, normalizeAlgorithm(options.algorithm))];
                                    case 2:
                                        checksum = _a.sent();
                                        if (!options.print)
                                            spinner.succeed(file + " " + chalk.blue(checksum));
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_2 = _a.sent();
                                        if (options.failFast) {
                                            spinner.fail(file + " " + chalk.dim(e_2));
                                            softThrow('Failing fast to error', true);
                                        }
                                        if (!options.print)
                                            spinner.fail(file + " " + chalk.dim(e_2));
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/, file && checksum
                                            ? path.normalize(file) + " " + checksum
                                            : null];
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
function normalizeAlgorithm(algorithm) {
    return algorithm.replace('-', '').toLowerCase();
}
function parseSFV(input, isSFV) {
    if (isSFV === void 0) { isSFV = true; }
    var lines = Array.isArray(input)
        ? stripComments(input)
        : stripComments(input.split('\n'));
    var regex = isSFV
        ? /^(.*)\s+(\w{8})$/g
        : /^(.*)\s+(\w{32,128})$/g;
    return lines.map(function (line) {
        var _a = line
            .trim()
            .split(regex)
            .filter(function (item) { return item; }), file = _a[0], checksum = _a[1];
        return file && checksum
            ? {
                file: path.normalize(file),
                checksum: checksum
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
    console.log(linkedTitle);
}
function readSFV(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var fileContents, isSFV;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.promises.readFile(filePath)];
                case 1:
                    fileContents = (_a.sent()).toString();
                    isSFV = filePath.endsWith('.sfvx')
                        ? false
                        : true;
                    return [2 /*return*/, parseSFV(fileContents.toString(), isSFV)];
            }
        });
    });
}
function setComment(useWinSFV) {
    var _a = getDate(), year = _a.year, month = _a.month, day = _a.day, hours = _a.hours, minutes = _a.minutes, seconds = _a.seconds;
    return useWinSFV
        ? "; Generated by WIN-SFV32 v1.1a on " + year + "-" + month + "-" + day + " at " + hours + ":" + minutes + "." + seconds + "\r\n;"
        : "; " + meta.name + " v" + meta.version + " | " + meta.homepage + "\n;";
}
function softThrow(message, newLine) {
    if (newLine === void 0) { newLine = false; }
    process.on('exit', function () {
        var prefix = newLine
            ? '\n'
            : '';
        console.log(prefix + "\uD83D\uDD25 " + message);
    });
    process.exit(1);
}
function stripComments(lines) {
    return lines.filter(function (line) {
        return !line
            .trim()
            .startsWith(';');
    });
}
function writeSFV(fileName, fileContents, algorithm) {
    return __awaiter(this, void 0, void 0, function () {
        var fileExtension, outputFile, spinner, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileExtension = algorithm === 'crc32'
                        ? '.sfv'
                        : '.sfvx';
                    outputFile = fileName.endsWith(fileExtension)
                        ? fileName
                        : "" + fileName + fileExtension;
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
                    e_3 = _a.sent();
                    spinner.fail(outputFile + " " + chalk.dim(e_3));
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
    .option('-a, --algorithm <algorithm>', 'specifies hashing algorithm', false)
    .option('-f, --fail-fast', 'stops execution after first error', false)
    .option('-o, --output <file>', 'specifies output file')
    .option('-p, --print', 'prints SFV file to stdout', false)
    .option('-s, --sort', 'sorts output', false)
    .option('-w, --winsfv', 'enables WinSFV compatibility', false)
    .parse(process.argv);
var completedIn = '\n✨ Completed in';
var lineBreak = program.winsfv
    ? '\r\n'
    : '\n';
var files = program.args;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var sfvFiles;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!program.print)
                    console.time(completedIn);
                if (!files.length) return [3 /*break*/, 5];
                if (!program.print)
                    printTitle();
                sfvFiles = files.filter(function (file) { return file.endsWith('.sfv') || file.endsWith('.sfvx'); });
                if (!sfvFiles.length) return [3 /*break*/, 2];
                return [4 /*yield*/, validationMode()];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: return [4 /*yield*/, creationMode()];
            case 3: return [2 /*return*/, _a.sent()];
            case 4: return [3 /*break*/, 6];
            case 5:
                program.help();
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); })();
function creationMode() {
    return __awaiter(this, void 0, void 0, function () {
        var algorithm, options, sfvFile, outputString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (program.algorithm && program.winsfv)
                        softThrow('The algorithm and WinSFV options can\'t be combined', true);
                    algorithm = program.algorithm
                        ? program.algorithm
                        : 'crc32';
                    options = {
                        algorithm: algorithm,
                        failFast: program.failFast,
                        print: program.print
                    };
                    return [4 /*yield*/, calculateChecksum(files, options)];
                case 1:
                    sfvFile = (_a.sent()).filter(function (item) { return item; });
                    if (!sfvFile.length)
                        softThrow('Aborting, empty SFV file', true);
                    sfvFile.unshift(setComment(program.winsfv));
                    sfvFile = sfvFile.filter(function (line) { return line; });
                    outputString = program.sort
                        ? sfvFile.sort().join(lineBreak)
                        : sfvFile.join(lineBreak);
                    if (!!program.print) return [3 /*break*/, 4];
                    if (!program.output) return [3 /*break*/, 3];
                    return [4 /*yield*/, writeSFV(program.output, outputString, algorithm)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    console.timeEnd(completedIn);
                    return [3 /*break*/, 5];
                case 4:
                    console.log(outputString);
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function validationMode() {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, compareSFV(files, program.failFast)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    softThrow('Failing fast due to mismatch');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, console.timeEnd(completedIn)];
            }
        });
    });
}
