class Helpers{
	static getMissingParam(args) {
		if(typeof args !== "object") {
			return "server";
		}
		
		let data = args.data;
		let keys = args.keys;
		
		if(!(keys instanceof Array) || typeof data !== "object") {
			return "server";
		}
		
		for(let i = 0; i < keys.length; ++i) {
			if(!data[keys[i]] && parseInt(data[keys[i]]) !== 0) {
				return keys[i];
			}
		}
		
		return null;
	}
	
	static trim(data) {
		if(!data || typeof data !== 'object') {
			return;
		}
		
		for (let prop in data) {
			if(!data.hasOwnProperty(prop)) {
				continue;
			}
			
			if (typeof data[prop] === 'string')
				data[prop] = data[prop].trim();
		}
	}
}

module.exports = Helpers;