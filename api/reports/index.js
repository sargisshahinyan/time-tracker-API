const express= require('express');
const router = express.Router();

// models
const Reports = require(APP_PATH + '/models/reports');
const Projects = require(APP_PATH + '/models/projects');

// helpers
const helpers = require(APP_PATH + '/libs/helpers');

// data for reports
const fields = ['note', 'projectId', 'spentTime'];

router.get('/', function (req, res, next) {
	const optionalKeys = ['limit', 'offset', 'projectId'];
	
	let data = {};
	const user = res.locals.user;
	
	optionalKeys.forEach(key => {
		if(key in req.query) {
			data[key] = req.query[key];
		}
	});
	
	let promise = Promise.resolve();

	if(user.role !== 1) {
		data.userId = user.id;
		
		if('projectId' in data) {
			promise = Projects.checkUserProject(data.projectId, user.id)
		}
	} else {
		if(!('projectId' in data)) {
			return res.status(403).json({
				'message': 'You must select a project'
			});
		}
	}
	
	promise.then(() => {
		Reports.getReports(data).then(reports => res.json(reports), err => next(err));
	}, () => {
		res.status(403).json({
			'message': 'You can view only your project reports'
		});
	});
});

router.get('/:id', function(req, res) {
	const id = Number(req.params.id);
	
	if(isNaN(id)) {
		return res.status(403).json({
			message: 'Invalid id'
		});
	}
	
	Projects.checkUserProject(data.projectId, res.locals.user.id).then(() => {
		Reports.getReport(id).then(report => res.json(report), err => res.status(404).json(err));
	}, () => {
		res.status(403).json({
			'message': 'You can view only your project reports'
		});
	});
});

router.post('/', function (req, res) {
	const param = helpers.getMissingParam({
		keys: fields,
		data: req.body
	});
	
	if(param) {
		res.status(403).json({
			'message': `${param} parameter is missing`
		});
		return;
	}
	
	const data = {};
	
	fields.forEach(field => data[field] = req.body[field]);
	data.userId = res.locals.user.id;
	
	Projects.checkUserProject(data.projectId, res.locals.user.id).then(() => {
		Reports.addReport(data).then(() => {
			res.status(201).json({
				'message': 'Report has been created successfully'
			});
		}, err => res.status(400).json(err));
	}, () => {
		res.status(403).json({
			'message': 'You can add only your project reports'
		});
	});
});

router.put('/:id', function (req, res) {
	const id = Number(req.params.id);
	const userId = res.locals.user.id;
	
	if(isNaN(id)) {
		res.status(403).json({
			message: 'Invalid id'
		});
		return;
	}
	
	const param = helpers.getMissingParam({
		keys: fields,
		data: req.body
	});
	
	if(param) {
		res.status(403).json({
			'message': `${param.replace(/^./, l => l.toUpperCase())} parameter is missing`
		});
		return;
	}
	
	Reports.getReport(id).then(report => {
		if(report.userId !== userId) {
			return res.status(403).json({
				'message': 'You can only edit your reports'
			});
		}
		
		const data = {};
		
		fields.forEach(field => data[field] = req.body[field]);
		
		Reports.editReport(id, data).then(() => {
			res.json({
				'message': 'Report has been updated successfully'
			});
		}, err => res.status(400).json(err));
	});
});

router.delete('/:id', function (req, res) {
	const id = Number(req.params.id);
	const userId = res.locals.user.id;
	
	if(isNaN(id)) {
		res.status(403).json({
			message: 'Invalid id'
		});
		return;
	}
	
	Reports.getReport(id).then(report => {
		if(report.userId !== userId) {
			return res.status(403).json({
				'message': 'You can only delete your reports'
			});
		}
		
		Reports.deleteReport(id).then(() => res.json({
			'message': 'Report deleted successfully'
		}), err => res.status(400).json(err));
	});
});

module.exports = router;