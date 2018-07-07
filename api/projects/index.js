const express= require('express');
const router = express.Router();

const projects = require(APP_PATH + '/models/projects');

router.use(function (req, res, next) {
    if (res.locals.user.role !== 1){
        return res.status(403).json({
            'message': 'Developer can not delete project'
        });
    }

    next();
});


/**
 * POST /Create project
 */
router.post('/', function(req, res) {
    let title = req.body.title, detail = req.body.details, status = req.body.status;
    projects.create(title, detail, status).then((result) => {

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
    projects.getById(req.params.id).then((result) => {
        res.json(result)
    });
});


/**
 * PUT / Update Project
 */
router.put('/:id', function(req, res) {
    let id = req.params.id, title = req.body.title, detail = req.body.details, status = req.body.status;

    projects.update(title, detail, status, id).then((result) => {

        res.json({status: result ? 'Project Updated' : 'project does not exist'});
    });
});


/**
 * DELETE / Delete Project
 */
router.delete('/:id', function(req, res) {
    projects.delete(req.params.id).then((result) => {
        res.json({status: result ? 'Project Deleted' : 'project does not exist'});
    });
});


/**
 * POST / Add developer to project
 */
router.post('/:projId/dev/:devId', function(req, res) {
    let projectId = req.params.projId, developerId = req.params.devId;
    projects.addDevToProject(projectId, developerId).then((result) => {
        console.log(result);
        res.json({status: result ? 'Developer added to project' : 'No such developer or project'});
    });
});

/**
 * POST / Remove developer to project
 */
router.delete('/:projId/dev/:devId', function(req, res) {
    let projectId = req.params.projId, developerId = req.params.devId;
    projects.removeDevFromProject(projectId, developerId).then((result) => {
        res.json({status: result ? 'Developer removed from project' : 'No such developer in project'});
    });
});
module.exports = router;