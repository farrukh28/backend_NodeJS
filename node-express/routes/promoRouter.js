const exrpess = require('express');
const bodyParser = require('body-parser');


// Declare Router
const promoRouter = exrpess.Router();

promoRouter.use(bodyParser.json());


promoRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next(); // executes next function matching /dishes endpoint
    })
    .get((req, res, next) => {
        res.end("We'll send all the promotions to you!");
    })
    .post((req, res, next) => {
        res.end("Will add the promo: " + req.body.name + " with details: " + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /promotions.");
    })
    .delete((req, res, next) => {
        res.end("Deleting all the promotions.");
    });

promoRouter.route('/:promoId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next(); // executes next function matching /dishes endpoint
    })
    .get((req, res, next) => {
        res.end("We'll send the promo: " + req.params.promoId);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /promo:" + req.params.promoId);
    })
    .put((req, res, next) => {
        res.write("Updating the promo: " + req.params.promoId + "\n");
        res.end("Modifying the promo: " + req.body.name + " and description: " + req.body.description);
    })
    .delete((req, res, next) => {
        res.end("Deleting the promo: " + req.params.promoId);
    });




module.exports = promoRouter;

