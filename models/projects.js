const connection = require('./connection');

const TABLE = '`projects`';
const DEVS_PROJECTS_TABLE = '`developer_projects`';

class Projects {
	static getAll() {
		return new Promise((resolve) => {
			connection.query(`SELECT * FROM ${TABLE} ORDER BY id`, (err, res) => {
				if(err) throw err;

				resolve(res);
			});
		});
	}

	static getById(id) {
		return new Promise((resolve) => {
			connection.query(`SELECT * FROM ${TABLE} WHERE id= ?`, [id], (err, res) => {
				if(err) throw err;

				resolve(res)
			});
		});
	}

	static getDeveloperActive(dev_id) {
		let sql = `SELECT id, title, details FROM ${TABLE} AS t JOIN ${DEVS_PROJECTS_TABLE} AS t1 ON t.id = t1.projectId WHERE t1.developerId = ?`;
		return new Promise((resolve, reject) => {
			connection.query(sql, [dev_id], (err, res) => {
				if(err) throw err;

				resolve(res);
			});
		});
	}

	static create(title, details) {
		let sql = `INSERT INTO ${TABLE} SET title = ?, details = ?`;
		return new Promise((resolve, reject) => {
			connection.query(sql, [title, details], (err, res) => {
				if(err) throw err;
				resolve(res);
			});
		});
	}

	static delete(id) {
		let sql = `DELETE FROM ${TABLE} WHERE id = ?`;
		return new Promise((resolve, reject) => {
			connection.query(sql, [id], (err, res) => {
				if(err) throw err;

				resolve(res.affectedRows)
			});
		});
	}

	static update(id, title = '`title`', details = '`details`') {
		let sql = `UPDATE ${TABLE} SET title = ?, details = ? WHERE id = ?`;
		return new Promise((resolve, reject) => {
			connection.query(sql, [title, details, id] ,  (err, res) => {
				if(err) throw err;
				
				res.affectedRows ? resolve(res.affectedRows) : reject(null);
			});
		});
	}

	static getDeveloperFromProject(developerId, projectd){
	    let sql = `SELECT * FROM ${DEVS_PROJECTS_TABLE} WHERE developerId = ? AND projectId = ?`;
        return new Promise((resolve) => {
            connection.query(sql, [developerId, projectd], (err, res) => {
                if(err) throw err;
                resolve(res);
            });
        });
    }

	static addDevToProject(projectId, developerId) {
        let sql = `INSERT ${DEVS_PROJECTS_TABLE} SET ?`;
        return new Promise((resolve, reject) => {
            Projects.getDeveloperFromProject(developerId, projectId).then((result) => {
                if (!result.length){
                    return connection.query(sql, {developerId, projectId}, (err, res) => {
                        if(err) throw err;

                        resolve(res.affectedRows);
                    });
                }

                reject(null);
            });
        });
    }

    static removeDevFromProject(projectId, developerId){

        let sql = `DELETE FROM ${DEVS_PROJECTS_TABLE} WHERE developerId = ? AND projectId = ?`;
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