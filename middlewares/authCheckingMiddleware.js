// models
const Users = require(`${APP_PATH}/models/users`);

module.exports = function (req, res, next) {
	const authHeader = req.headers['authorization'] || '',
		token = authHeader.split(/\s+/).pop() || '';
	
	if(!token) {
		res.status(401).json({
			message: 'Token required'
		});
		return;
	}
	
	Users.checkToken(token).then(user => {
		res.locals.user = user;
		next();
	}, err => {
        console.log(err);
		res.status(401).json(err)
    });
};