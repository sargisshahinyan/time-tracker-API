const express= require('express');
const router = express.Router();

// models
const Users = require(`${APP_PATH}/models/users`);

router.get('/', function(req, res) {
	if(res.locals.user.role === roles.manager) {
		Users.getDevelopers().then(user => res.json(user), err => res.status(404).json(err));
	} else {
		return res.status(403).json({
		    'message': 'Developer can not accept this resource'
		});
	}
});

module.exports = router;
