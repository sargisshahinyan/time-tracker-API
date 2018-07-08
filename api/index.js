const express = require('express');
const router = express.Router();

const routes = ['/reports', '/projects', '/users', '/developers'];


// models
const Users = require(`${APP_PATH}/models/users`);
const Encryption = require(`${APP_PATH}/models/Encryption`);

// middleware
const authCheckingMiddleware = require(`${APP_PATH}/middlewares/authCheckingMiddleware`);

router.post('/auth', function (req, res) {
	const
		header = req.headers['authorization'] || '',
		token = header.split(/\s+/).pop() || '',
		auth = Encryption.base64Decode(token);
	
	const [username, password] = auth.split(':');
	
	Users.authUser(username,password).then(user => {
		Users.setUserToken(user).then(token => {
			res.json({
				token
			});
		});
	}, () => {
		res.status(404).json({
			message: "Incorrect username or password"
		});
	});
});

router.use(authCheckingMiddleware);

router.get('/users', function (req, res) {
	res.json({
		message: "Hello"
	});
});

routes.forEach(route => router.use(route, require(`.${route}`)));


module.exports = router;