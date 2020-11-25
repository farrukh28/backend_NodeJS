const express = require('express');
const bodyParser = require('body-parser');

//authentication file
const authenticate = require('../authenticate');

//---------------- CORS ------------------------------
const cors = require('./cors');
//----------------------------------------------------

// ------------ Models --------------------------------
const Comments = require('../models/comments');
//----------------------------------------------------

const commentRouter = express.Router();

commentRouter.use(bodyParser.json());


//---------------------------FOR COMMENTS "CRUD" Operations-----------------------------

commentRouter.route('/')
    // supports CORS Pre-flight
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        // getting comments
        Comments.find(req.query)
            .populate('author')
            .then((comments) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(comments); // returns json respose to the body of response message
            }, (err) => next(err))
            .catch((err) => {
                next(err);
            });
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        // creating a comment
        // if body contains comment
        if (req.body != null) {
            req.body.author = req.user._id; // explicitly adding author to comments
            Comments.create(req.body)
                .then((comment) => {
                    Comments.findById(comment._id)
                        .populate('author')
                        .then((comment) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', "application/json");
                            res.json(comment);
                        })
                }, (err) => next(err))
                .catch((err) => next(err));
        }
        // if body of comment is empty
        else {
            err = new Error('Comment not found in request body.');
            err.status = 404;
            return next(err);
        }

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /comments");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        // deleting all comments
        Comments.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', "application/json");
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// -------- Handling Requests with Parameters

commentRouter.route('/:commentId')
    // supports CORS Pre-flight
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        // getting comment with comment id
        Comments.findById(req.params.commentId)
            .populate('author')
            .then((comment) => {
                if (comment != null) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    // sending back specific comment
                    res.json(comment);
                }
                else {
                    err = new Error("Comment " + req.params.commentId + " not found.");
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /comments/" + req.params.commentId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Comments.findById(req.params.commentId)
            .then((comment) => {
                if (comment != null) {
                    // check if comment to be updated has "same" author as who has requested to update
                    var checkUser = req.user._id.equals(comment.author);

                    if (checkUser) {

                        req.body.author = req.user._id;
                        //only allow rating and comment to be changed not author
                        Comments.findByIdAndUpdate(req.params.commentId, { $set: req.body }, { new: true })
                            .then((updatedComment) => {
                                Comments.findById(updatedComment._id)
                                    .populate('author')
                                    .then((updatedComment) => {
                                        res.statusCode = 200;
                                        res.setHeader("Content-Type", "application/json");
                                        res.json(updatedComment);
                                    })
                            }, (err) => next(err));
                    }
                    else {
                        var err = new Error("You are not authorised to update this comment.");
                        err.status = 403;
                        next(err);
                    }
                }
                else {
                    err = new Error("Comment " + req.params.commentId + " not found.");
                    err.status = 404;
                    return next(err);
                }
            }, (err) => { next(err) })
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        // deleting specific comment from specific dish
        Comments.findById(req.params.commentId)
            .then((comment) => {
                if (comment != null) {
                    var checkUser = req.user._id.equals(comments.author);
                    if (checkUser) {
                        Comments.findByIdAndRemove(req.params.commentId)
                            .then((resp) => {
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.json(resp);
                            }, (err) => next(err))
                            .catch((err) => next(err));
                    }
                    else {
                        var err = new Error("You are not authorised to delete this comment.");
                        err.status = 403;
                        next(err);
                    }
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });



module.exports = commentRouter;