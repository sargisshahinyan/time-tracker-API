const connection = require('./connection');

const TABLE = '`projects`';
const DEVS_PROJECTS_TABLE = '`developer_projects`';

class Projects {
	static getAll() {
		return new Promise((resolve, reject) => {
			connection.query(`SELECT * FROM ${TABLE} ORDER BY id`, [], (err, res) => {
				if(err) throw err;
				let data = res || null;
				data ? resolve(data) : reject(null);
			});
		});
	}

	static getById(id) {
		return new Promise((resolve, reject) => {
			connection.query(`SELECT * FROM ${TABLE} WHERE id= ?`, [id], (err, res) => {
				if(err) throw err;
				let data = res || null;
				data ? resolve(data) : reject(null);
			});
		});
	}

	static getDeveloperActive(dev_id) {
		var sql = `SELECT * FROM ${TABLE} AS t JOIN ${DEVS_PROJECTS_TABLE} AS t1 ON t.id = t1.projectId WHERE t1.developerId = ? AND t.status = 1`;
		return new Promise((resolve, reject) => {
			connection.query(sql, [dev_id], (err, res) => {
				if(err) throw err;
				
				let data = res[0] || null;

				data ? resolve(data) : reject(null);
			});
		});
	}

	static create(title, details, status) {
		var sql = `INSERT INTO ${TABLE} SET title = ?, details = ?, status = ?`;
		return new Promise((resolve, reject) => {
			connection.query(sql, [title, details, status], (err, res) => {
				if(err) throw err;
				resolve(res);
			});
		});
	}

	static delete(id) {
		var sql = `DELETE FROM ${TABLE} WHERE id = ?`;
		return new Promise((resolve, reject) => {
			connection.query(sql, [id], (err, res) => {
				if(err) throw err;
				console.log(res.affectedRows)
				res.affectedRows ? resolve(res.affectedRows) : reject(null);
			});
		});
	}

	static update(id, title, details, status) {
		var sql = `UPDATE ${TABLE} SET title = ?, details = ?, status = ? WHERE id = ?`;
		return new Promise((resolve, reject) => {
			connection.query(sql, [id, title, details, status] ,  (err, res) => {
				if(err) throw err;
				
				res.affectedRows ? resolve(res.affectedRows) : reject(null);
			});
		});
	}

	static getDeveloperFromProject(developerId, projectd){
	    var sql = `SELECT * FROM ${DEVS_PROJECTS_TABLE} WHERE developerId = ? AND projectId = ?`;
        return new Promise((resolve, reject) => {
            connection.query(sql, [developerId, projectd], (err, res) => {
                if(err) throw err;
                res ? resolve(res) : reject(null);
            });
        });
    }

	static addDevToProject(projectId, developerId){
        var sql = `INSERT ${DEVS_PROJECTS_TABLE} SET developerId = ?, projectId = ?`;
        return new Promise((resolve, reject) => {
            Projects.getDeveloperFromProject(developerId, projectId).then((result) => {
                if (!result.length){
                    connection.query(sql, [developerId, projectId], (err, res) => {
                        if(err) throw err;
                        resolve(res.affectedRows);
                    });
                } reject(null);
            });
        });
    }

    static removeDevFromProject(projectId, developerId){

        var sql = `DELETE FROM ${DEVS_PROJECTS_TABLE} WHERE developerId = ? AND projectId = ?`;
        return new Promise((resolve, reject) => {
            connection.query(sql, [developerId, projectId], (err, res) => {
                if(err) throw err;
                res.affectedRows ? resolve(res.affectedRows) : reject(null);
            });
        });
    }

    static checkUserProject(projectId, userId) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT * FROM ${DEVS_PROJECTS_TABLE} WHERE developerId = ? AND projectId = ?`, [userId, projectId], (err, result) => {
				if(err) throw err;
				
				result.length ? resolve() : reject();
			})
		});
	}
}

module.exports = Projects;