const express= require('express');
const router = express.Router();

// models
const Users = require(`${APP_PATH}/models/users`);

router.get('/', function (req, res) {
	const keys = ['limit', 'offset'];
	let data = {};
	const user = res.locals.user;
	
	if(!user || !Number(user.role)) {
		return res.status(403).json({
			'message': 'You are not permitted for this action'
		});
	}
	
	keys.forEach(key => {
		if(key in req.query) {
			data[key] = req.query[key];
		}
	});
	
	Users.getUsers(data).then(users => res.json(users), err => res.status(404).json(err));
});

router.get('/:id', function(req, res) {
	const id = Number(req.params.id);
	const user = res.locals.user;
	
	if(!user || !Number(user.role)) {
		return res.status(403).json({
			'message': 'You are not permitted for this action'
		});
	}
	
	if(isNaN(id)) {
		res.status(403).json({
			message: 'Invalid id'
		});
		return;
	}
	
	Users.getUser(id).then(user => res.json(user), err => res.status(404).json(err));
});

router.get('/developers', function(req, res) {
	console.log("FGFGFg")
	Users.getDevelopers().then(user => res.json(user), err => res.status(404).json(err));
});

module.exports = router;