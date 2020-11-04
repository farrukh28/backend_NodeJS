const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new Schema({

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


const dishSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    comments: [commentSchema] // shows dishSchema can store array of comments of type commentSchema (sub-document)
}, {
    timestamps: true
});

var Dishes = mongoose.model('dish', dishSchema);

module.exports = Dishes;