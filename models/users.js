const connection = require('./connection');
const expDays = 5;

const USERS_TABLE = '`users`';
const Encryption = require(`${APP_PATH}/models/Encryption`);

class Users {
	static getUser(id) {
		return new Promise((resolve, reject) => {
			connection.query(`SELECT * FROM ${USERS_TABLE} WHERE id = ?`, [id], (err, users) => {
				if(err) throw err;
				
				let user = users[0] || null;
				
				if(user) {
					delete user.password;
				}
				
				user ? resolve(user) : reject(null);
			});
		});
	}
	
	static authUser(username, password) {
		password = Encryption.createHash(password);
		
		return new Promise((resolve, reject) => {
			connection.query(`SELECT * FROM ${USERS_TABLE} WHERE username = ? AND password = ?`, [username, password], (err, rows) => {
				if(err) throw err;
				
				rows.length ? resolve(rows[0]) : reject({
					'message': 'Incorrect username or password'
				});
			});
		});
	}
	
	static setUserToken(user){
		const expDate = new Date();
		expDate.setDate(expDate.getDate() + expDays);
		
		const header = {
			"alg": "HS256",
			"typ": "JWT"
		};
		let payload = {
			"iss": user.id,
			"exp": expDate.toISOString(),
			"manager": !!parseInt(user.role)
		};
		
		const encodedHeader = Encryption.base64Encode(JSON.stringify(header));
		const encodedPayload = Encryption.base64Encode(JSON.stringify(payload));
		
		const signature = Encryption.cryptText(`${encodedHeader}.${encodedPayload}`);
		
		return Promise.resolve(`${encodedHeader}.${encodedPayload}.${signature}`);
	}
	
	static checkToken(token) {
		return new Promise(function (resolve, reject) {
			const [header, payload = '', signature = ''] = token.split('.');
			
			if(signature !== Encryption.cryptText(`${header}.${payload}`)) {
				return reject({
					message: 'Invalid token'
				});
			}


			const { iss, exp } = JSON.parse(Encryption.base64Decode(payload));

			const expDate = new Date(exp);
			const currentDate = new Date();

			if(expDate < currentDate) { 
				return reject({
					message: 'Token expired'
				});
			}

			Users.getUser(iss).then(resolve, reject);
		});
	}

	static getDevelopers(){
		return new Promise((resolve, reject) => {
			connection.query(`SELECT u.name, p.title FROM users as u LEFT JOIN developer_projects as dp on dp.developerId = u.id LEFT JOIN projects as p on p.id = dp.projectId
WHERE u.role = ?`, [roles.developer], (err, res) => {
				if(err) throw err;
				let data = res.length ? res : null;
				data ? resolve(data) : reject(null);
			});
		});
	}

}

module.exports = Users;