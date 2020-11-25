const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const favDishesScehma = new Schema({
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dish'
    }
});



const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    favDishes: [favDishesScehma]
}, {
    timestamps: true
});


const Favorites = mongoose.model('favorite', favoriteSchema);


module.exports = Favorites;