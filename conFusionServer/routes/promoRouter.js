const exrpess = require('express');
const bodyParser = require('body-parser');

//------------------- DATABASE------------------------

const mongoose = require('mongoose');
const Promotions = require('../models/promotions');

//----------------------------------------------------

// Declare Router
const promoRouter = exrpess.Router();

promoRouter.use(bodyParser.json());


promoRouter.route('/')
    .get((req, res, next) => {
        Promotions.find({})
            .then((allPromotions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(allPromotions);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Promotions.create(req.body)
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /promotions.");
    })
    .delete((req, res, next) => {
        Promotions.remove({})
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

promoRouter.route('/:promoId')
    .get((req, res, next) => {
        Promotions.findById(req.params.promoId)
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /promo:" + req.params.promoId);
    })
    .put((req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoId, { $set: req.body }, { new: true })
            .then((updatedPromo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(updatedPromo)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response)
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = promoRouter;

