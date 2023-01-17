const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});

RestaurantSchema.plugin(passportLocalMongoose);
module.exports = new mongoose.model("Restaurant", RestaurantSchema);  
