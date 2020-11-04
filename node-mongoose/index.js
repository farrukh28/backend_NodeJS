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
            return Dishes.findByIdAndUpdate(dish._id, { $set: { description: "Updated Test", } }, {
                new: true // if true returns updated dishes object
            }).exec();
        })
        .then((dish) => {
            console.log(dish);
            // adding comments to dish
            dish.comments.push({
                rating: 5,
                comment: "It's very tasty. I recommend you to give it a try!!!",
                author: "Farrukh",
            });

            return dish.save(); // saves this specific document because we modified it.
        })
        .then((dish) => {

            console.log(dish);
            return Dishes.remove({});
        })
        .then(() => {
            return mongoose.connection.close();
        })
        .catch((err) => console.log(err));
})
    .catch((err) => console.log(err)); 