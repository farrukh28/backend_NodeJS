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
        // populating author field with the user who posted the comment
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' // refrences which collection to be connected (user Collections)
    },
    comment: {
        type: String,
        required: true
    },
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dish'
    }
}, {
    timestamps: true
});


var Comments = mongoose.model('comment', commentSchema);

module.exports = Comments;