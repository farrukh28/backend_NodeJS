const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


// authenticate
const authenticate = require('../authenticate');

// models
const favorite = require('../models/favorite');
const { put } = require('../app');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());



favoriteRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        favorite.findOne({ user: req.user._id })
            .populate('favDishes.dish')
            .populate('user')
            .exec()
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.end("Put Operation not Supported");
    }, (err) => next(err))
    .post(authenticate.verifyUser, (req, res, next) => {
        favorite.findOne({ user: req.user._id })
            .then((user) => {
                if (user) { // if user exists
                    console.log("User Exists");
                    for (var i = 0; i <= (req.body.dishes.length - 1); i++) {
                        if (user.favDishes.length <= 0) { // if favDishes is empty
                            for (var i = 0; i <= (req.body.dishes.length - 1); i++) {
                                console.log("FavDishes empty.");
                                user.favDishes.push(req.body.dishes[i]);
                            }
                        }
                        else {
                            for (var i = 0; i <= (req.body.dishes.length - 1); i++) {
                                if (user.favDishes.id(req.body.dishes[i]) === null) {
                                    user.favDishes.push(req.body.dishes[i]);
                                }
                                else {
                                    console.log("Dish already exist ", req.body.dishes[i]);
                                }
                            }
                        }
                    }
                    user.save()
                        .then((user) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(user);
                        })
                }
                // user does not exists
                else {
                    console.log('User does not Exist.');
                    favorite.create({ user: req.user._id })
                        .then((user) => {
                            for (var i = 0; i <= (req.body.dishes.length - 1); i++) {
                                user.favDishes.push(req.body.dishes[i]);
                            }
                            user.save()
                                .then((user) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(user);
                                })
                        }, (err) => next(err))
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    }, (err) => next(err))
    .delete(authenticate.verifyUser, (req, res, next) => {
        favorite.findOne({ user: req.user._id })
            .then((doc) => {
                if (doc) {
                    doc.remove()
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(doc);
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end('Document Does not exist.');
                }
            }, (err) => next(err))
    }, (err) => next(err))



favoriteRouter.route('/:dishId')
    .post(authenticate.verifyUser, (req, res, next) => {
        favorite.findOne({ user: req.user._id })
            .then((user) => {
                if (user) {
                    if (user.favDishes.id(req.params.dishId)) { // dish already exist
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end('Dish already exists in favourites');
                    }
                    else {
                        user.favDishes.push(req.params.dishId);
                        user.save()
                            .then((user) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(user);
                            })
                    }
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end('User does not exist');
                }
            }, (err) => next(err))
    }, (err) => next(err))
    .delete(authenticate.verifyUser, (req, res, next) => {
        favorite.findOne({ user: req.user._id })
            .then((user) => {
                if (user && user.favDishes.id(req.params.dishId) !== null) {
                    user.favDishes.id(req.params.dishId).remove();
                    user.save()
                        .then((user) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({ user: user, status: "Deleted" });
                        }, (err) => next(err))
                }
                else if (!user) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end("No User Found.");
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end("Dish does not exist.");
                }
            }, (err) => next(err))
    }, (err) => next(err))



module.exports = favoriteRouter;