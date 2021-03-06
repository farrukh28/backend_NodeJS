const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express(); // Creates an Express application
// Express provdes bunch of methods to make our web server

const hostname = "localhost";
const port = "3000";


const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

// Mouting Router
app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use('/leaders', leaderRouter);


app.use(morgan('dev')); // Logs HTTP requests on console
app.use(bodyParser.json()); // parses request body message which is in JSON format
app.use(express.static(__dirname + "/public")); // Public folder will server for HTML files


app.use((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end("<html><body><h1>This is an Express Server.</h1></body></html>");
});


const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});