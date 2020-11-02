const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());


leaderRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next(); // executes next function matching /dishes endpoint
    })
    .get((req, res, next) => {
        res.end("We'll send all the leaders to you!");
    })
    .post((req, res, next) => {
        res.end("Will add the leader: " + req.body.name + " with details: " + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /leaders.");
    })
    .delete((req, res, next) => {
        res.end("Deleting all the leaders.");
    });


leaderRouter.route('/:leaderId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next(); // executes next function matching /dishes endpoint
    })
    .get((req, res, next) => {
        res.end("We'll send the leader: " + req.params.leaderId);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /leaders:" + req.params.leaderId);
    })
    .put((req, res, next) => {
        res.write("Updating the leader: " + req.params.leaderId + "\n");
        res.end("Modifying the leader: " + req.body.name + " and description: " + req.body.description);
    })
    .delete((req, res, next) => {
        res.end("Deleting the leader: " + req.params.leaderId);
    });


module.exports = leaderRouter;