const connection = require('./connection');

const REPORTS_TABLE = '`reports`';

class Reports {
	static getReports(config = {}) {
		const defaultConfigs = {
			limit: 200,
			offset: 0,
			projectId: '%',
			userId: '%'
		};
		
		if(!config || typeof config !== 'object') {
			config = {};
		}
		
		for(let prop in defaultConfigs) {
			if(!defaultConfigs.hasOwnProperty(prop)) {
				continue;
			}
			
			config[prop] = !isNaN(parseInt(config[prop])) ? parseInt(config[prop]) : defaultConfigs[prop];
		}
		
		return new Promise((resolve) => {
			connection.query(`
				SELECT id, note, spentTime
				FROM ${REPORTS_TABLE} WHERE projectId LIKE ? AND userId LIKE ? LIMIT ?, ?`,
				[config['projectId'], config['userId'], config['offset'], config['limit']], function (err, reports) {
					if(err) throw err;
					
					resolve(reports);
				});
		});
	}
	
	static getReport(id){
		return new Promise((resolve) => {
			connection.query(`SELECT id, note, spentTime FROM ${REPORTS_TABLE} WHERE id = ?`, [id], (err, reports) => {
				if(err) throw err;
				
				let report = reports[0] || null;
				
				if(report) {
					delete report.password;
				}
				
				resolve(report);
			});
		});
	}
	
	static addReport(data) {
		return new Promise((resolve, reject) => {
			connection.query(`INSERT INTO ${REPORTS_TABLE} SET ?`, data, (err, res) => {
				if(err) throw err;
				
				Reports.getReport(res.insertId).then(report => {
					report ? resolve(report) : reject({
						message: 'Invalid report id'
					});
				}, reject);
			});
		});
	}
	
	static editReport(id, data) {
		return new Promise((resolve, reject) => {
			connection.query(`UPDATE ${REPORTS_TABLE} SET ? WHERE id = ?`, [data, id], (err) => {
				if(err) throw err;
				
				Reports.getReport(id).then(report => {
					report ? resolve(report) : reject({
						message: 'Invalid report id'
					});
				}, reject);
			});
		});
	}
	
	static deleteReport(id) {
		return new Promise((resolve) => {
			connection.query(`DELETE FROM ${REPORTS_TABLE} WHERE id = ?`, [id], (err) => {
				if(err) throw err;
				
				resolve(id);
			});
		});
	}
}

module.exports = Reports;