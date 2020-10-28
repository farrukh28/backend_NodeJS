const http = require("http"); // importing http module from node
const fs = require("fs"); // importing file-sharing module from node
const path = require("path"); // to get file paths


const hostname = "localhost";
const port = "3000";


const server = http.createServer((req, res) => {
    console.log("Request for " + req.url + "by the method " + req.method);

    // Handling if GET method
    if (req.method == "GET") {
        var fileUrl;
        if (req.url == "/") {
            fileUrl = "/index.html";
        }
        else {
            fileUrl = req.url;
        }

        // finding path and extension of file
        var filePath = path.resolve("./public" + fileUrl);
        var fileExt = path.extname(filePath);

        //handling if HTML file
        if (fileExt == ".html") {
            fs.access(filePath, (error) => {
                if (error) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "text/html");
                    res.end("<html><body><h1>Error 404: " + fileUrl + " does not exist.</h1></body></html>");
                }
                else {
                    fs.readFile(filePath, (err, data) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/html");
                        res.write(data);
                        res.end();
                    });
                }
            });
        }
        else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/html");
            res.end("<html><body><h1>Error 404: " + fileUrl + " is not an HTML file.</h1></body></html>");
        }
    }
    else { // if not GET method
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html");
        res.end("<html><body><h1>Error 404: Server does not currently support " + req.method + "</h1></body></html>");
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});