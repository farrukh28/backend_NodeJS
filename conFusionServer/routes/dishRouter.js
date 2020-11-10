const express = require('express');
const bodyParser = require('body-parser');

//authentication file
const authenticate = require('../authenticate');


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
    .post(authenticate.verifyUser, (req, res, next) => {
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
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /dishes.");
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
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
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /dishes:" + req.params.dishId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => { next(err) })
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        // deleting specific dish from collection
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            })
            .catch((err) => next(err));
    });

//---------------------------FOR COMMENTS "CRUD" Operations-----------------------------

dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        // getting comments
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dish.comments); // returns json respose to the body of response message
                }
                else {
                    err = new Error("Dish " + req.params.dishId + " not found.");
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => {
                next(err);
            });
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        // creating a comment
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    dish.comments.push(req.body);
                    dish.save() // will return updated dish
                        .then((updatedDish) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(updatedDish);
                        }, (err) => next(err));
                }
                else {
                    err = new Error("Dish " + req.params.dishId + " not found.");
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /dishes" + req.params.dishId + "/comments");
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        // deleting all comments
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    for (var i = (dish.comments.length - 1); i >= 0; i--) {
                        // way of accessing the sub-documents in parent document
                        // id() is method to pull sub-documents
                        dish.comments.id(dish.comments[i]._id).remove();
                    }
                    dish.save() // return dish after all comments are deleted
                        .then((updatedDish) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(updatedDish);
                        }, (err) => next(err));
                }
                else {
                    err = new Error("Dish " + req.params.dishId + " not found");
                    err.status = 404;
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// -------- Handling Requests with Parameters

dishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        // getting comment with dishId and comment id
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    // sending back specific comment
                    res.json(dish.comments.id(req.params.commentId));
                }
                else if (dish == null) {
                    err = new Error("Dish " + req.params.dishId + " not found.");
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error("Comment " + req.params.commentId + " not found.");
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /dishes:" + req.params.dishId + "/comments/" + req.params.commentId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    //only allow author and comment to be changed
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    dish.save()
                        .then((updatedDish) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(updatedDish)
                        }, (err) => next(err));
                }
                else if (dish == null) {
                    err = new Error("Dish " + req.params.dishId + " not found.");
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error("Comment " + req.params.commentId + " not found.");
                    err.status = 404;
                    return next(err);
                }
            }, (err) => { next(err) })
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        // deleting specific comment from specific dish
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = dishRouter;