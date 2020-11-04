const mongoose = require('mongoose');
const Dishes = require('./models/dishes');


const url = 'mongodb://127.0.0.1:27017/conFusion';


const connect = mongoose.connect(url); // connecting to database

connect.then((db) => {
    console.log("Connected to the SERVER!");

    Dishes.create({
        name: "Uthappizza",
        description: "test"
    })
        .then((dish) => {
            console.log(dish);
            return Dishes.find({}).exec();
        })
        .then((dishes) => {
            console.log(dishes);
            return Dishes.remove({});
        })
        .then(() => {
            return mongoose.connection.close();
        })
        .catch((err) => console.log(err));
})
    .catch((err) => console.log(err)); 