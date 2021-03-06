const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer'); // for uploading files


const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

//---------------- CORS ------------------------------
const cors = require('./cors');
//----------------------------------------------------

//------- Configure Multer------------------------

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        var Extentsion = file.originalname.split('.')[1];
        cb(null, req.user.username + "." + Extentsion);
    }
});

// This function helps filter the files to be uploaded
const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("You can upload only image files!"), false);
    }
    cb(null, true) // when files is accepted
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

//-----------------------------------------------


uploadRouter.route('/')
    .options(cors.corsWithOptions, (res, req) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET Operation not supported on /imageUpload');
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT Operation not supported on /imageUpload.');
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE Operation not supported on /imageUpload.');
    });






module.exports = uploadRouter;