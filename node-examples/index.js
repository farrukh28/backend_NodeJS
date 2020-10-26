var rect = require("./rectangle"); // importing file based node_module

function solveRect(l, b) {
    console.log("Solving for rectangle with l = " + l + " and b = " + b);

    // supplying callback function
    rect(l, b, (err, rectangle) => {
        if (err) {
            console.log("ERROR: " + err.message);
        }
        else {
            console.log("The area of rectangle is: " + rectangle.area());
            console.log("The perimeter of rectangle is: " + rectangle.perimeter());
        }
    });

    console.log("This statement is after rect function call.")

};

solveRect(2, 4);
solveRect(3, 5);
solveRect(0, 5);
solveRect(-3, 5)