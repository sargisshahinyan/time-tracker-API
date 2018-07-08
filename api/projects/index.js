const express= require('express');
const router = express.Router();

const projects = require(APP_PATH + '/models/projects');
const keys = ['title', 'details'];


/**
 * GET /All projects
 */
router.get('/', function(req, res) {
    let action;
    switch(res.locals.user.role) {
        default:
        case 0:
            action = projects.getDeveloperActive.bind(projects, res.locals.user.id);
            break;
        case 1:
            action = projects.getAll.bind(projects);
    }

    action().then((result) => {
        res.json(result);
    });
});

router.use(function (req, res, next) {
    if (res.locals.user.role !== 1){
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
 * GET / Project By Id
 */
router.get('/:id', function(req, res) {
    const id = req.params.id;
    
    if(!Number(id)) {
        return res.status(403).json({
            'message': 'Invalid id'
        });
    }
    
    projects.getById(id).then((result) => {
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
router.post('/:projectId/developers/', function(req, res) {
    const 
    	projectId = req.params.projectId, 
    	developerId = req.body.developerId;

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
        res.json({status: result ? 'Developer added to project' : 'No such developer or project'});
    }, () => res.json({
        message: 'Developer already on project'
    }));
});

/**
 * POST / Remove developer to project
 */
router.delete('/:projectId/developers/:developerId', function(req, res) {
    const 
    	projectId = req.params.projectId, 
    	developerId = req.params.developerId;

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
        res.json({status: result ? 'Developer removed from project' : 'No such developer on project'});
    });
});

module.exports = router;
