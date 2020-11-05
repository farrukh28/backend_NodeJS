const express = require('express');
const bodyParser = require('body-parser');



//------------------- DATABASE------------------------

const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

//----------------------------------------------------

const dishRouter = express.Router(); // Declaring a Router
dishRouter.use(bodyParser.json());

// ------------------ HANDLING REQUESTS------------------------

dishRouter.route('/')
    .get((req, res, next) => {
        // getting dishes
        Dishes.find({})
            .then((allDishes) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(allDishes); // returns json respose to the body of response message
            }, (err) => next(err))
            .catch((err) => {
                next(err);
            });
    })
    .post((req, res, next) => {
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
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /dishes.");
    })
    .delete((req, res, next) => {
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
    .get((req, res, next) => {
        // getting dish with dishId
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /dishes:" + req.params.dishId);
    })
    .put((req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => { next(err) })
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
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