const express= require('express');
const router = express.Router();

const projects = require(APP_PATH + '/models/projects');
const keys = ['title', 'details'];

router.use(function (req, res, next) {
    if (res.locals.user.role !== roles.manager){
        return res.status(403).json({
            'message': 'Developer can not accept this resource'
        });
    }

    next();
});

router.post('/', function(req, res) {
    const key = keys.find(key => !req.body[key]);
    
    if(key) {
        return res.status(403).json({
            'message': `${key} parametr is missing`
        });
    }
    
    const { title, details } = req.body;
    projects.create(title, details).then((result) => {
        res.status(201).json({status: result.affectedRows ? 'Project Created' : 'error'})
    });
});


/**
 * GET /All projects
 */
router.get('/', function(req, res) {
    projects.getAll().then((result) => {
        res.json(result)
    });
});


/**
 * GET / Project By Id
 */
router.get('/:id', function(req, res) {
    const id = req.params.id;
    
    if(!Number(id)) {
        return res.status(403).json({
            'message': 'Invalid id'
        });
    }
    
    projects.getById(req.params.id).then((result) => {
        res.json(result)
    });
});


/**
 * PUT / Update Project
 */
router.put('/:id', function(req, res) {
    const id = req.params.id;
    
    if(!Number(id)) {
        return res.status(403).json({
            'message': 'Invalid id'
        });
    }
    
    const key = keys.find(key => !req.body[key]);
    
    if(key) {
        return res.status(403).json({
            'message': `${key} parametr is missing`
        });
    }

    const { title, details } = req.body;
    projects.update(id, title, details).then((result) => {

        res.json({status: result ? 'Project Updated' : 'project does not exist'});
    });
});


/**
 * DELETE / Delete Project
 */
router.delete('/:id', function(req, res) {
    const id = req.params.id;
    
    if(!Number(id)) {
        return res.status(403).json({
            'message': 'Invalid id'
        });
    }
    
    projects.delete(id).then((result) => {
        res.json({status: result ? 'Project Deleted' : 'project does not exist'});
    });
});


/**
 * POST / Add developer to project
 */
router.post('/:projId/dev/:devId', function(req, res) {
    const 
    	projectId = req.params.projId, 
    	developerId = req.params.devId;

    if(!Number(projectId)) {
    	return res.status(403).json({
    		message: 'Invalid project id'
    	});
    }
    
    if(!Number(developerId)) {
    	return res.status(403).json({
    		message: 'Invalid developer id'
    	});
    }

    projects.addDevToProject(projectId, developerId).then((result) => {
        console.log(result);
        res.json({status: result ? 'Developer added to project' : 'No such developer or project'});
    }, () => res.json({
        message: 'Developer already on project'
    }));
});

/**
 * POST / Remove developer to project
 */
router.delete('/:projId/dev/:devId', function(req, res) {
    const 
    	projectId = req.params.projId, 
    	developerId = req.params.devId;

    if(!Number(projectId)) {
    	return res.status(403).json({
    		message: 'Invalid project id'
    	});
    }
    
    if(!Number(developerId)) {
    	return res.status(403).json({
    		message: 'Invalid developer id'
    	});
    }

    projects.removeDevFromProject(projectId, developerId).then((result) => {
        res.json({status: result ? 'Developer removed from project' : 'No such developer in project'});
    });
});

module.exports = router;
