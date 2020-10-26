module.exports = (x, y, callback) => { // callback is a function passed as an argument
    if (x <= 0 || y <= 0) {
        setTimeout(() =>
            callback(new Error("Rectangle dimensions should be greater than zero."), null),
            2000);
    }
    else {
        setTimeout(() =>
            callback(null, {
                perimeter: () => (2 * (x * y)),
                area: () => (x * y)
            }),
            2000);
    }
};




