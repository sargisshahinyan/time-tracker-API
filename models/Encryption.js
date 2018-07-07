const crypto = require('crypto');
const SECRET = 'tdffdudQU6y6Lmv5479I';
const ALGORITHM = 'sha256';

class Encryption {
	static createHash(text) {
		return crypto.createHash(ALGORITHM).update(text).digest('hex');
	}
	
	static cryptText(text) {
		return crypto.createHmac(ALGORITHM, SECRET)
			.update(text)
			.digest('hex');
	}
	
	static base64Encode(text) {
		return Buffer.from(text).toString('base64');
	}
	
	static base64Decode(text) {
		return Buffer.from(text, 'base64').toString('ascii')
	}
}

module.exports = Encryption;