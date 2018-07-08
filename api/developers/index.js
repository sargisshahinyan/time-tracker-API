const express= require('express');
const router = express.Router();

// models
const Users = require(`${APP_PATH}/models/users`);

router.get('/', function(req, res) {
	Users.getDevelopers().then(user => res.json(user), err => res.status(404).json(err));
});

module.exports = router;