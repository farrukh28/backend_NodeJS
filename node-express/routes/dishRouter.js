const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router(); // Declaring a Router
dishRouter.use(bodyParser.json());

// ------------------ HANDLING REQUESTS

dishRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next(); // executes next function matching /dishes endpoint
    })
    .get((req, res, next) => {
        res.end("We'll send all the dishes to you!");
    })
    .post((req, res, next) => {
        res.end("Will add the dish: " + req.body.name + " with details: " + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /dishes.");
    })
    .delete((req, res, next) => {
        res.end("Deleting all the dishes.");
    });

// -------- Handling Requests with Parameters

dishRouter.route('/:dishId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next(); // executes next function matching /dishes endpoint
    })
    .get((req, res, next) => {
        res.end("We'll send the dish: " + req.params.dishId);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /dishes:" + req.params.dishId);
    })
    .put((req, res, next) => {
        res.write("Updating the dish: " + req.params.dishId + "\n");
        res.end("Modifying the dish: " + req.body.name + " and description: " + req.body.description);
    })
    .delete((req, res, next) => {
        res.end("Deleting the dishes: " + req.params.dishId);
    });


module.exports = dishRouter;