const express = require('express');
const bodyParser = require('body-parser');

//authentication file
const authenticate = require('../authenticate');

//---------------- CORS ------------------------------
const cors = require('./cors');
//----------------------------------------------------


//------------------- DATABASE------------------------

const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

//----------------------------------------------------

const dishRouter = express.Router(); // Declaring a Router
dishRouter.use(bodyParser.json());


// ------------------ HANDLING REQUESTS------------------------

dishRouter.route('/')
    // supports CORS Pre-flight
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        // getting dishes
        Dishes.find(req.query)
            // .populate('comments.author') // specify which field to populate
            .then((allDishes) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(allDishes); // returns json respose to the body of response message
            }, (err) => next(err))
            .catch((err) => {
                next(err);
            });
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        // creating a dish
        Dishes.create(req.body)
            .then((dish) => {
                console.log("Dish created : ", dish);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /dishes.");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        // deleting all dishes
        Dishes.remove({})
            .then((response) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// -------- Handling Requests with Parameters

dishRouter.route('/:dishId')
    // supports CORS Pre-flight
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        // getting dish with dishId
        Dishes.findById(req.params.dishId)
            // .populate('comments.author')
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /dishes:" + req.params.dishId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => { next(err) })
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        // deleting specific dish from collection
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            })
            .catch((err) => next(err));
    });


module.exports = dishRouter;